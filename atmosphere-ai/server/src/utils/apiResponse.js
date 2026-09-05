export class ApiResponse {
  static success(res, data, arg3 = 'Success', arg4 = 200) {
    let statusCode = 200;
    let message = 'Success';

    if (typeof arg3 === 'number') {
      statusCode = arg3;
      if (typeof arg4 === 'string') message = arg4;
    } else if (typeof arg3 === 'string') {
      message = arg3;
      if (typeof arg4 === 'number') statusCode = arg4;
    }

    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }
}

export default ApiResponse;