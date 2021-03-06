# 八仙傷患名單搜尋

## 功能

* 狀況報告
  * 受傷 / 重傷 / 出院 人數
  * 資料來源
  * 最後修改時間
* 提醒
* 搜尋
  * 可針對全部欄位搜尋
  * 模糊搜尋，例如： 林文君 可找到 林○君
* 傷者資訊列表：
  * 收治單位
    * 縣市 / 醫院 / 電話
  * 個人資料
    * 姓名 / 性別 / 年齡 / 國籍
  * 狀況
    * 即時動態
    * 傷勢
    * 編號 / 檢傷編號

## 使用技術

  * Angular JS
    * ng-infinite-scrolling: Delay Render 的時機點，在讀取 API 資料後，先 Render 前 40 筆資料，之後再依據 Scroll 做即時 Render
    * angular-material: Material Design
  * Lodash: Functional library
  * Fuse: Fussy search library
  * GA tracking
