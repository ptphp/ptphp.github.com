var converter = null;
converter = new Markdown.Converter();
function updateMd(id,content) {
     if (content.lenght != 0) {
         var html = converter.makeHtml(content);
         //console.log($('#'+id).parents(".require").find("#preview"));
         $('#preview').html(html);
     }
}