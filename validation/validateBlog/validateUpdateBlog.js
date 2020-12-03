
const { isBlogMandatoryFieldNotFilled } = require('./isBlogMandatoryFieldNotFilled');
const { isBlogTitleLengthValid } = require('./isBlogTitleLengthValid');
const { isBlogSeqValidNumber } = require('./isBlogSeqValidNumber');
const { isUpdateBlogTitleDuplicate } = require('./isUpdateBlogTitleDuplicate');
const {
    BLOG_MANDATORY_FIELD,
    BLOG_DUPLICATE_BLOG_TITLE,
    BLOG_TITLE_INVALID_LENGTH,
    BLOG_SEQ_INVALID_NUMBER,
    INTERNAL_SERVER_ERROR_BLOG_CHECK_DUP
} = require('../validationConstants');

module.exports = {
    validateUpdateBlog: async function (blogID,
                                        blogTitle,
                                        blogCategoryID,
                                        blogTag,
                                        blogSeq,
                                        userID,
                                        sidebarMenuID) {
        //frontend supposed to guard this, just in case someone change the js in frontend
        if (isBlogMandatoryFieldNotFilled(blogTitle, blogCategoryID, blogTag, blogSeq)) {
            return ({ Status: 400, Code: BLOG_MANDATORY_FIELD, errMessage: 'Blog Title, Category, Tag and Seq is Mandatory' });
        }

        if (!isBlogTitleLengthValid(blogTitle)) {
            return ({ Status: 400, Code: BLOG_TITLE_INVALID_LENGTH, errMessage: 'Blog Title cannot be more than 30 characters' });
        }

        if (!isBlogSeqValidNumber(blogSeq)) {
            return ({ Status: 400, Code: BLOG_SEQ_INVALID_NUMBER, errMessage: 'Seq must be between 1 to 1000' });
        }

        const isBlogTitleDuplicateResult = await isUpdateBlogTitleDuplicate(blogID, blogTitle, sidebarMenuID, userID);
        if (typeof (isBlogTitleDuplicateResult) !== "boolean") {
            return ({ Status: 500, Code: INTERNAL_SERVER_ERROR_BLOG_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        } else {
            if (isBlogTitleDuplicateResult)
                return ({ Status: 400, Code: BLOG_DUPLICATE_BLOG_TITLE, errMessage: 'Blog Title is duplicate' });
        }

        return ({ Status: 200 });
    }
}