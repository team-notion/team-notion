import Lottie from "react-lottie-player";
import Spin from '../../../assets/json/spinner-white.json'


const style = { height: "70px", width: "70px" };

export default function Spinner() {
  return (
    <span className="text-green-500">
      <Lottie animationData={Spin} style={style} play />
    </span>
  );
}
