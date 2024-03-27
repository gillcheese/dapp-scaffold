import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Look at my stick</title>
        <meta
          name="description"
          content="Look at my stick dot com"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
