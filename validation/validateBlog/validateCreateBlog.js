
const { isBlogMandatoryFieldNotFilled } = require('./isBlogMandatoryFieldNotFilled');
const { isCreateBlogTitleDuplicate } = require('./isCreateBlogTitleDuplicate');
const { isBlogTitleLengthValid } = require('./isBlogTitleLengthValid');
const { isBlogSeqValidNumber } = require('./isBlogSeqValidNumber');
const {
    BLOG_MANDATORY_FIELD,
    BLOG_DUPLICATE_BLOG_TITLE,
    BLOG_TITLE_INVALID_LENGTH,
    BLOG_SEQ_INVALID_NUMBER,
    INTERNAL_SERVER_ERROR_BLOG_CHECK_DUP
} = require('../validationConstants');

module.exports = {
    validateCreateBlog: async function (blogTitle,
                                        blogCategoryID,
                                        blogTag,
                                        blogSeq,
                                        userID,
                                        sidebarMenuID) {
        //frontend also check
        if (isBlogMandatoryFieldNotFilled(blogTitle, blogCategoryID, blogTag, blogSeq)) {
            return ({ Status: 400, Code: BLOG_MANDATORY_FIELD, errMessage: 'Blog Title, Blog Category, Blog Tag and Seq is Mandatory' });
        }
        //frontend also check
        if (!isBlogTitleLengthValid(blogTitle)) {
            return ({ Status: 400, Code: BLOG_TITLE_INVALID_LENGTH, errMessage: 'Blog Title cannot be more than 30 characters' });
        }
        //frontend also check
        if (!isBlogSeqValidNumber(blogTag)) {
            return ({ Status: 400, Code: BLOG_SEQ_INVALID_NUMBER, errMessage: 'Seq must be between 1 to 1000' });
        }

        const isBlogTitleDuplicateResult = await isCreateBlogTitleDuplicate(blogTitle, sidebarMenuID, userID);
        if (typeof (isBlogTitleDuplicateResult) !== "boolean") {
            return ({ Status: 500, Code: INTERNAL_SERVER_ERROR_BLOG_CHECK_DUP, errMessage: 'Internal Server Error, please try again' });
        } else {
            if (isBlogTitleDuplicateResult)
                return ({ Status: 400, Code: BLOG_DUPLICATE_BLOG_TITLE, errMessage: 'Blog Title is duplicate' });
        }

        return ({ Status: 200 });
    }
}