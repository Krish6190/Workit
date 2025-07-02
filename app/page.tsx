import Image from "next/image";
import Authentication from "./Authenticate";

export default function Home() {
  return(
    <div>
    <div className="welcome">
      Welcome
      <br></br>
      So who are we serving Today
    </div>
    <Authentication></Authentication>
    </div>
  );
}
