const buildApiUrls = (URL_SERVICE) => ({
    member: {
        verifyemail                 : URL_SERVICE + "/amala/verification/link/v1.2/verify",
    },
    memberotp: {
        public: {
            secondstimelimit        : URL_SERVICE + "/amala/otp/data/public/v1.2/secondstimelimit",
            verification            : URL_SERVICE + "/amala/otp/transaction/public/v1.2/verification"
        }
    },
})

module.exports = { buildApiUrls };