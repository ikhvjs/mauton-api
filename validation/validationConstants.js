//base
exports.NO_ERROR = 'NO_ERROR';

//Registration
exports.REG_MANDATORY_FIELD = 'REG_MANDATORY_FIELD';
exports.REG_DUPLICATE_USERNAME = 'REG_DUPLICATE_USERNAME';
exports.REG_DUPLICATE_EMAIL = 'REG_DUPLICATE_EMAIL';
exports.REG_INVALID_EMAIL = 'REG_INVALID_EMAIL';
exports.REG_INVALID_USERNAME = 'REG_INVALID_USERNAME';
exports.REG_INVALID_PASSWORD = 'REG_INVALID_PASSWORD';
exports.REG_INVALID_CAPTCHA_TOKEN = 'REG_INVALID_CAPTCHA_TOKEN';

exports.INTERNAL_SERVER_ERROR_REG_DE = 'INTERNAL_SERVER_ERROR_RDE';
exports.INTERNAL_SERVER_ERROR_REG_DU = 'INTERNAL_SERVER_ERROR_REG_DU';
exports.INTERNAL_SERVER_ERROR_REG_ICT = 'INTERNAL_SERVER_ERROR_REG_ICT';
exports.INTERNAL_SERVER_ERROR_REG_INSERT = 'INTERNAL_SERVER_ERROR_REG_INSERT';

//Login
exports.SIGNIN_MANDATORY_FIELD  = 'SIGNIN_MANDATORY_FIELD';
exports.SIGNIN_INVALID_EMAIL    = 'SIGNIN_INVALID_EMAIL';
exports.SIGNIN_GRANT_TYPE_MANDATORY = 'SIGNIN_GRANT_TYPE_MANDATORY';
exports.SIGNIN_INVALID_CLIENT = 'SIGNIN_INVALID_CLIENT';
exports.SIGNIN_INVALID_CAPTCHA_TOKEN = 'SIGNIN_INVALID_CAPTCHA_TOKEN';

exports.INTERNAL_SERVER_ERROR_SIGNIN_ICT = 'INTERNAL_SERVER_ERROR_SIGNIN_ICT';
exports.INTERNAL_SERVER_ERROR_SIGNIN_SELECT = 'INTERNAL_SERVER_ERROR_SIGNIN_SELECT';

//Tag
exports.TAG_DUPLICATE_TAG_NAME = 'TAG_DUPLICATE_TAG_NAME';
exports.TAG_MANDATORY_FIELD = 'TAG_MANDATORY_FIELD';
exports.TAG_FOREIGN_KEY_EXIST = 'TAG_FOREIGN_KEY_EXIST';
exports.TAG_NAME_INVALID_LENGTH = 'TAG_NAME_INVALID_LENGTH';
exports.TAG_SEQ_INVALID_NUMBER = 'TAG_SEQ_INVALID_NUMBER';
exports.INTERNAL_SERVER_ERROR_TAG_CHECK_DUP = 'INTERNAL_SERVER_ERROR_TAG_CHECK_DUP';
exports.INTERNAL_SERVER_ERROR_TAG_INSERT = 'INTERNAL_SERVER_ERROR_TAG_INSERT';
exports.INTERNAL_SERVER_ERROR_TAG_SEARCH = 'INTERNAL_SERVER_ERROR_TAG_SEARCH';
exports.INTERNAL_SERVER_ERROR_TAG_DELETE = 'INTERNAL_SERVER_ERROR_TAG_DELETE';
exports.INTERNAL_SERVER_ERROR_TAG_REQUEST = 'INTERNAL_SERVER_ERROR_TAG_REQUEST';
exports.INTERNAL_SERVER_ERROR_TAG_UPDATE = 'INTERNAL_SERVER_ERROR_TAG_UPDATE';
exports.INTERNAL_SERVER_ERROR_TAG_CHECK_FOREIGN_KEY = 'INTERNAL_SERVER_ERROR_TAG_CHECK_FOREIGN_KEY';

//Category
exports.CATEGORY_MANDATORY_FIELD = 'CATEGORY_MANDATORY_FIELD';
exports.CATEGORY_DUPLICATE_CATEGORY_NAME = 'CATEGORY_DUPLICATE_CATEGORY_NAME';
exports.INTERNAL_SERVER_ERROR_CATEGORY_CHECK_DUP = 'INTERNAL_SERVER_ERROR_CATEGORY_CHECK_DUP';
exports.CATEGORY_NAME_INVALID_LENGTH = 'CATEGORY_NAME_INVALID_LENGTH';
exports.CATEGORY_DESC_INVALID_LENGTH = 'CATEGORY_DESC_INVALID_LENGTH';
exports.CATEGORY_SEQ_INVALID_NUMBER = 'CATEGORY_SEQ_INVALID_NUMBER';
exports.CATEGORY_FOREIGN_KEY_EXIST = 'CATEGORY_FOREIGN_KEY_EXIST';
exports.INTERNAL_SERVER_ERROR_CATEGORY_REQUEST = 'INTERNAL_SERVER_ERROR_CATEGORY_REQUEST';
exports.INTERNAL_SERVER_ERROR_CATEGORY_SEARCH = 'INTERNAL_SERVER_ERROR_CATEGORY_SEARCH';
exports.INTERNAL_SERVER_ERROR_CATEGORY_CREATE = 'INTERNAL_SERVER_ERROR_CATEGORY_CREATE';
exports.INTERNAL_SERVER_ERROR_CATEGORY_DELETE = 'INTERNAL_SERVER_ERROR_CATEGORY_DELETE';
exports.INTERNAL_SERVER_ERROR_CATEGORY_UPDATE = 'INTERNAL_SERVER_ERROR_CATEGORY_UPDATE';
exports.INTERNAL_SERVER_ERROR_CATEGORY_CHECK_FOREIGN_KEY = 'INTERNAL_SERVER_ERROR_CATEGORY_CHECK_FOREIGN_KEY';

//Menu1
exports.INTERNAL_SERVER_ERROR_MENU1_REQUEST = 'INTERNAL_SERVER_ERROR_MENU1_REQUEST';