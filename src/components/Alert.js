import { notification } from 'antd';

const Alert = Object.assign(
    {
        success: (message = '') => notification['success']({ message: 'Success', description: message }),
        error: (message = '') => notification['error']({ message: 'Error', description: message, duration: null }),
        information: (message = '') => notification['info']({ message: 'Information', description: message, duration: null })
    }
)

export default Alert;