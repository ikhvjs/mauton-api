module.exports = {
    isBlogTitleLengthValid:  function (blogTitle) {
        return ((blogTitle.length>30)?false:true)
    }

}