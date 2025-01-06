const DB_ID = "YOUR_DATABASE_ID";
const API_KEY = "YOUR_API_KEY";
const NOTION_API = {
  async createPage(book) {
    try {
      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer "+API_KEY,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: {
            type: "database_id",
            database_id: DB_ID,
          },
          icon: {
            type: "emoji",
            emoji: "📖",
          },
          properties: {
            书名: {
              title: [
                {
                  text: { content: book.title },
                },
              ],
            },
            作者: {
              rich_text: [
                {
                  text: { content: book.author },
                },
              ],
            },
            出版时间: {
              rich_text: [
                {
                  text: { content: book.publishDate },
                },
              ],
            },
            出版商: {
              rich_text: [
                {
                  text: { content: book.publisher },
                },
              ],
            },
            ISBN: {
              rich_text: [
                {
                  text: { content: book.ISBN },
                },
              ],
            },
            豆瓣url: {
              url: book.url,
            },
            评分: {
              rich_text: [
                {
                  text: { content: book.rating },
                },
              ],
            },
            封面: {
              files: [
                {
                  name: book.title,
                  external: { url: book.img },
                },
              ],
            },
          },
        }),
      });

      const result = await response.json();
      console.log("Notion页面创建成功:", result);
      return result;
    } catch (error) {
      console.error("创建Notion页面失败:", error);
      throw error;
    }
  },
};

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendToNotion") {
    NOTION_API.createPage(request.book)
      .then((result) => sendResponse({ success: true, result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // 保持消息通道打开
  }
});
