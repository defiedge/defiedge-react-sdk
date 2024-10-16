export function getErrorMessage(error: any) {
  return (
    (error &&
      (error.error?.data?.message ||
        error.data?.message ||
        error.reason ||
        error.message)) ||
    ""
  ).split("(data=")[0];
}
