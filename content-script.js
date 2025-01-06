function getBookInfo() {
  let book = {};
  // 获取基本信息容器
  let info = document.getElementById("info");

  // 获取标题
  book.title = document.querySelector("h1 span").textContent.trim();

  // 获取作者等信息
  let spans = info.getElementsByTagName("span");
  //get url from this page
  book.url = window.location.href;
  for (let span of spans) {
    let text = span.textContent.trim();

    // 通过标签的 class 获取作者
    if (span.className === "pl") {
      let nextText = span.nextSibling?.textContent?.trim();
      console.log("nextText", nextText);
      switch (text) {
        case "作者":
          // 修改作者提取逻辑
          let authorNode = span.nextElementSibling;
          if (authorNode && authorNode.querySelector) {
            // 如果下一个节点是链接，提取链接中的文本
            let authorText = authorNode.textContent.trim();
            book.author=authorText
          } else {
            book.author = authorNode;
          }
          break;
        case "出版社:":
          let publisherNode = span.nextElementSibling;
          if (publisherNode && publisherNode.querySelector) {
            // 如果下一个节点是链接，提取链接中的文本
            let publisherText = publisherNode.textContent.trim();
            console.log("publisherText", publisherText);
            book.publisher = publisherText;
          } else {
            book.publisher = publisherNode;
          }
          break;
        case "原作名:":
          book.originTitle = nextText;
          break;
        case "出版年:":
          book.publishDate = nextText;
          break;
        case "ISBN:":
          book.ISBN = nextText;
          break;
      }
    }
  }
  // 获取图片
  book.img = document.querySelector("#mainpic img").src;

  // 获取评分
  book.rating = document.querySelector(".rating_num")?.textContent?.trim();

  console.log("提取的图书信息：", book);
  return book;
}

async function sendToNotion(book) {
  try {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          action: "sendToNotion",
          book: book,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("发送消息错误:", chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log("收到响应:", response);
            resolve(response);
          }
        }
      );
    });
  } catch (error) {
    console.error("发送消息失败：", error);
    throw error;
  }
}

const bookInfo = getBookInfo();
console.log("bookInfo", bookInfo);
sendToNotion(bookInfo);
