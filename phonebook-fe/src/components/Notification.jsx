export const Notification = ({ type, message }) => {
  if (!type || !message) {
    return null;
  }
  if (type === 'success') {
    return <div className="notification success">{message}</div>;
  }
  if (type === 'error') {
    return <div className="notification error">{message}</div>;
  }
};
