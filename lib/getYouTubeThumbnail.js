export default function youtube_parser(url) {
    if (url == null) {
        return false;
    }

    var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11
        ? `http://img.youtube.com/vi/${match[7]}/maxresdefault.jpg`
        : false;
}
