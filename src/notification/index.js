import { Notification } from 'element-ui';

function showSuccess(messageText = 'Operation successful') {
  Notification({
    title: 'Success',
    message: messageText,
    type: 'success',
  });
}

function showError(messageText = 'Oops, something went wrong...') {
  Notification({
    title: 'Error',
    message: messageText,
    type: 'error',
  });
}

function showWarning(messageText = 'Warning') {
  Notification({
    title: 'Warning',
    dangerouslyUseHTMLString: true,
    message: messageText,
    type: 'warning',
  });
}

export default {
  showSuccess,
  showError,
  showWarning,
};
