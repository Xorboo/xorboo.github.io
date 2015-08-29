using UnityEngine;
using System.Collections.Generic;
using Prime31;

public class InAppController : MonoBehaviour 
{
    public static InAppController instance;

    public string androidPublicKey = "Key from android developer portal";
    bool androidBillingSupported = false;

#if UNITY_IOS && !UNITY_EDITOR	
	List<StoreKitProduct> _products;
#elif UNITY_ANDROID && !UNITY_EDITOR
    List<GooglePurchase> _products;
#endif

    void Awake()
    {
        instance = this;
    }

	void Start ()
    {
        InAppProducts.LoadLocalProducts();

        Init();
        SetQueryCallbacks();
        SetPurchaseCallbacks();
        QueryProducts();
        LoadSavedTransactions();
	}

    public void Purchase(string id)
    {
        ScreenLogger.instance.AddMessage("Trying to buy: " + id);
        ShowLoading();
        if (PurchasingAvailible())
        {
            ScreenLogger.instance.AddMessage("Purchasing avalible, requesting '" + id + "'");
#if UNITY_EDITOR
            HideLoading();
#elif UNITY_IOS
		    StoreKitBinding.purchaseProduct(id, 1);
#elif UNITY_ANDROID
            GoogleIAB.purchaseProduct(id);
#endif
        }
        else
        {
            ScreenLogger.instance.AddMessage("Error: Purchasing unavalivle!");
            PopupInfo.Show(PopupController.NoInternetText);
        }
    }

    bool PurchasingAvailible()
    {
        bool result = Application.internetReachability != NetworkReachability.NotReachable;
        result &= InternetReachabilityVerifier.Instance.status == InternetReachabilityVerifier.Status.NetVerified;

#if UNITY_IOS && !UNITY_EDITOR
        result &= StoreKitBinding.canMakePayments();
#elif UNITY_ANDROID && !UNITY_EDITOR
        result &= androidBillingSupported;
#endif
        return result;
    }

    // Initialize markets
    void Init()
    {
#if UNITY_IOS && !UNITY_EDITOR	
        // Doing nothing
#elif UNITY_ANDROID && !UNITY_EDITOR
        GoogleIABManager.billingSupportedEvent += () =>
        {
            androidBillingSupported = true;
        };
        GoogleIABManager.billingNotSupportedEvent += result =>
        {
            Debug.LogError("Android billing error: " + result);
        };

        GoogleIAB.init(androidPublicKey);
        GoogleIAB.setAutoVerifySignatures(true);
#endif
    }

    // Callback for recieving information about currently bought products
    void SetQueryCallbacks()
    {
#if UNITY_IOS && !UNITY_EDITOR	
        // Necessary for making purchases
        StoreKitManager.productListReceivedEvent += allProducts =>
        {
            _products = allProducts;
            ScreenLogger.instance.AddMessage("Recieved products info: " + allProducts.Count);         
        };
#elif UNITY_ANDROID && !UNITY_EDITOR
        GoogleIABManager.queryInventorySucceededEvent += (purchases, skus) =>
        {
            _products = purchases;
            ScreenLogger.instance.AddMessage("Recieved products info: " + purchases.Count + ", and skus: " + skus.Count);

            InAppProducts.purchaseStatus = InAppProducts.PurchaseStatus.Restoring;
            foreach (var purchase in purchases)
            {                
                ScreenLogger.instance.AddMessage(
                    "Item '" + purchase.productId +
                    "' with status '" + purchase.purchaseState +
                    "' at " + new System.DateTime(purchase.purchaseTime * System.TimeSpan.TicksPerMillisecond, System.DateTimeKind.Utc));
                if (purchase.purchaseState == GooglePurchase.GooglePurchaseState.Purchased)
                {
                    PurchaseCompleted(purchase.productId);
                }
            }
        };
#endif
    }

    // Set callbacks for successful purchases
    void SetPurchaseCallbacks()
    {
#if UNITY_IOS && !UNITY_EDITOR
        // При покупке или восстановлении
		StoreKitManager.purchaseSuccessfulEvent += transaction =>
		{
            PurchaseCompleted(transaction.productIdentifier);
            HideLoading();
		};	
		StoreKitManager.purchaseFailedEvent += info =>
		{
            ScreenLogger.instance.AddMessage("Purchase failed: " + info);
            HideLoading();
		};	
		StoreKitManager.purchaseCancelledEvent += info =>
		{
            ScreenLogger.instance.AddMessage("Purchase cancelled: " + info);
            HideLoading();
		};	
#elif UNITY_ANDROID && !UNITY_EDITOR        
		GoogleIABManager.purchaseSucceededEvent += transaction =>
        {
            PurchaseCompleted(transaction.productId);
            HideLoading();
        };

        GoogleIABManager.purchaseCompleteAwaitingVerificationEvent += (s1, s2) =>
        {
            ScreenLogger.instance.AddMessage("Purchase awaiting verification '" + s1 + "'   '" + s2 + "'");
        };

        GoogleIABManager.purchaseFailedEvent += (info, code) =>
        {
            // Code - http://developer.android.com/google/play/billing/billing_reference.html
            if (code == 7)
            {
                // Продукт уже куплен, просто восстанавливаем его
                InAppProducts.purchaseStatus = InAppProducts.PurchaseStatus.Restoring;
                PurchaseCompleted(PopupParentalController._productId);
            }
            else
            {
                Debug.Log("Purchase failed [" + code + "] '" + info + "'");
                ScreenLogger.instance.AddMessage("Purchase failed [" + code + "] '" + info + "'");
            }
            HideLoading();
        };
#endif
    }
    
    // Try to load already bought products
    void QueryProducts()
    {
        string[] productIdentifiers = InAppProducts.GetProductIdentifiers();
        ScreenLogger.instance.AddMessage("Getting info on: " + (productIdentifiers != null ? string.Join("; ", productIdentifiers) : "NULL"));
#if UNITY_IOS && !UNITY_EDITOR	
        StoreKitBinding.requestProductData(productIdentifiers);
#elif UNITY_ANDROID && !UNITY_EDITOR
        GoogleIAB.queryInventory(productIdentifiers);
#endif
    }

    // Load saved on device transactions
    void LoadSavedTransactions()
    {
#if UNITY_IOS && !UNITY_EDITOR	
        ScreenLogger.instance.AddMessage("Loading saved transactions...");
        List<StoreKitTransaction> transactionList = StoreKitBinding.getAllSavedTransactions();

        foreach (StoreKitTransaction transaction in transactionList)
        {
            ScreenLogger.instance.AddMessage("Restored item: " + transaction.productIdentifier);
            InAppProducts._addProduct(transaction.productIdentifier);
        }
#elif UNITY_ANDROID && !UNITY_EDITOR
        // Looks like its not implemented :(
        // Doing that on queryInventorySucceededEvent 
#endif
    }

    // Successful purchase callback
    void PurchaseCompleted(string id)
    {
        InAppProducts._addProduct(id);

        switch (InAppProducts.purchaseStatus)
        {
            case InAppProducts.PurchaseStatus.Buying:
                ScreenLogger.instance.AddMessage("Item '" + id + "' purchased");
                AdjustLog.PackBought(PopupParentalController._productId);
                break;
            case InAppProducts.PurchaseStatus.Restoring:
                ScreenLogger.instance.AddMessage("Item '" + id + "' restored");
                break;
            default:
                Debug.LogError("Unknown status in purchasing '" + id + "' event: " + InAppProducts.purchaseStatus);
                break;
        }

        EpisodeChooser.instance.UpdateBuyAllButton();
    }

    void ShowLoading()
    {
        PopupController.ShowLoadingPopup();
    }

    void HideLoading()
    {
        PopupController.HideLoadingPopup();
    }
}