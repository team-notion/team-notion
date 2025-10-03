import { Oval } from "react-loader-spinner";

export default function PageLoaderModal() {
  return (
    <div
      className={`fixed top-0 left-0 z-[500] w-full h-screen flex justify-center items-center animation 
      opacity-100 visible
      `}
    >
      <div className="relative w-full right-0 h-auto  z-[500] flex flex-col items-center ">
        <Oval
          height="80"
          width="80"
          color="#006C33"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
          secondaryColor="white"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>

      <div
        className="absolute top-0 left-0 w-full h-full overflow-y-auto bg-[#00000066] z-20"
        // onClick={closeModal(false)}
      />
    </div>
  );
}
