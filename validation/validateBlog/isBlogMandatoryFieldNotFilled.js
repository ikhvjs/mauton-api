module.exports = {
    isBlogMandatoryFieldNotFilled:  function (blogTitle, blogCategoryID, blogTag, blogSeq) {
        return (!blogTitle || !blogCategoryID|| !blogSeq|| !(blogTag.length>0))
    }

}