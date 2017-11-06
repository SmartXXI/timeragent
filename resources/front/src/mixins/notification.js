const notification = {
    methods: {
        showSuccess(messageText = 'Operation successful') {
            this.$notify({
                title  : 'Success',
                message: messageText,
                type   : 'success',
            });
        },
        showError(messageText = 'Oops, something went wrong...') {
            this.$notify({
                title  : 'Error',
                message: messageText,
                type   : 'error',
            });
        },
    },
};

export default notification;
