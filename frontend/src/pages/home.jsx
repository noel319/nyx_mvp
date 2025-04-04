import Navbar from "../components/common/Navbar";
import Hero from "../components/views/hero";
import NyxCipher from "../components/views/nyxCipher";
import Advantage from "../components/views/advantage";
import NyxToolkit from "../components/views/nyxToolkit";
import NyxVsPaal from "../components/views/nyxVsPaal";
import Partnering from "../components/views/partnering";
import JoinUs from "../components/views/joinUs";
import Faqs from "../components/views/faqs";
import Footer from "../components/views/footer";

function Home() {

  return (
    <div id='home'>
      <Navbar />
      <Hero />
      <NyxCipher />
      <Advantage />
      <NyxToolkit />
      <NyxVsPaal />
      <Partnering />
      <JoinUs />
      <Faqs />
      <Footer />
    </div>
  );
}

export default Home;