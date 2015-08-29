using UnityEngine;
using System.Collections;

public class InAppProducts
{
    public enum PurchaseStatus
    {
        None,
        Buying,
        Restoring
    }
    // Статус, чтобы отсылать лог о покупке только при покупке, а не восстановлении
    public static PurchaseStatus purchaseStatus = PurchaseStatus.None; 

    /*public static string _allEpisodesId = "com.fyost.fixiki.all";
    //private static string _Episodes1Id = "com.fyost.fixiki.1";
    public static string _Episodes2Id = "com.fyost.fixiki.air";
    public static string _Episodes3Id = "com.fyost.fixiki.ice";
    public static string _Episodes4Id = "com.fyost.fixiki.laser";
    public static string _Episodes5Id = "com.fyost.fixiki.water";
    public static string _Episodes6Id = "com.fyost.fixiki.fire";*/

    public static string _NoAdsId = "com.fyost.fixiki.advert";

    private static ArrayList buyedProducts = new ArrayList();

    public static void _addProduct(string productId, bool saveLocally = true)
    {
        if (saveLocally)
        {
            SaveProductLocally(productId);
        }

        if (!buyedProducts.Contains(productId))
        {
            buyedProducts.Add(productId);
        }
    }

    public static string[] GetProductIdentifiers()
    {
#if UNITY_EDITOR
        Debug.Log("No product identifiers in unity");
        return null;
#elif UNITY_IOS
        return new string[] { _NoAdsId };
#elif UNITY_ANDROID
        return new string[] { _NoAdsId };
#else
        Debug.LogError("Unknown platform for GetProductIdentifiers()");
        return null;
#endif
    }

    public static bool AdsBought()
    {
        return _isItemBought(_NoAdsId);
    }

    public static bool _isItemBought(string id)
    {
        return buyedProducts.Contains(id);
    }
    
    // Load transactions saved manually (due to not loading on android)
   public static void LoadLocalProducts()
    {
        var ids = GetProductIdentifiers();

        if (ids != null)
        {
            foreach (string id in ids)
            {
                var hash = GetProductHash(id);
                if (PlayerPrefs.GetInt(hash, 0) == 1)
                {
                    _addProduct(id, false);
                }
            }
        }
    }

    static void SaveProductLocally(string id)
    {
        PlayerPrefs.SetInt(GetProductHash(id), 1);
    }

    static string GetProductHash(string id)
    {
        string res = UniqueIdentifier + Md5Sum(id);
        return Md5Sum(res);
    }

    static string UniqueIdentifier
    {
        get { return SystemInfo.deviceUniqueIdentifier; }
    }

    static string Md5Sum(string strToEncrypt)
    {
        System.Text.UTF8Encoding ue = new System.Text.UTF8Encoding();
        byte[] bytes = ue.GetBytes(strToEncrypt);

        // encrypt bytes
        System.Security.Cryptography.MD5CryptoServiceProvider md5 = new System.Security.Cryptography.MD5CryptoServiceProvider();
        byte[] hashBytes = md5.ComputeHash(bytes);

        // Convert the encrypted bytes back to a string (base 16)
        string hashString = "";

        for (int i = 0; i < hashBytes.Length; i++)
        {
            hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, '0');
        }

        return hashString.PadLeft(32, '0');
    }
}