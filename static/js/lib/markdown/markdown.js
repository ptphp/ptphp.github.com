var converter = null;
converter = new Markdown.Converter();
function updateMd(obj,content) {
     if (content.lenght != 0) {
         var html = converter.makeHtml(content);
         $(obj).html(html);
     }
}