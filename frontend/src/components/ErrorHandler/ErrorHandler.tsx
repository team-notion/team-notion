import { ExclamationIcon } from "../../assets";

const ErrorHandler = ({ errors }: { errors: any }) => {
  return (
    <div className="text-[#B00020] text-[12px] font-[400] flex items-center mt-2.5 ">
      {errors && <img src={ExclamationIcon} alt="" />}
      {errors && (
        <>
          {(() => {
            switch (errors) {
              case errors.type === "required":
                return (
                  <span className="mr-5 ml-2">
                    {errors.message ? errors.message : "This field is required"}
                  </span>
                );
              case errors.type === "maxLength" || errors.type === "max":
                return (
                  <span className="mr-5 ml-2">
                    {errors.message
                      ? errors.message
                      : "Your input exceeded the maximum length"}
                  </span>
                );
              case errors.type === "minLength" || errors.type === "min":
                return (
                  <span className="mr-5 ml-2">
                    {errors.message
                      ? errors.message
                      : "Your input is not up to the minimum length"}
                  </span>
                );
              case errors.type === "matches":
                return <span className="mr-5 ml-2">{errors.message}</span>;
              case errors.type === "typeError":
                return <span className="mr-5 ml-2">Invalid value entered</span>;
              default:
                return (
                  <span className="mr-5 ml-2">
                    {errors
                      ? errors
                      : errors.message
                      ? errors.message
                      : "The value entered into this field is invalid"}
                  </span>
                );
            }
          })()}
        </>
      )}
    </div>
  );
};

export default ErrorHandler;
