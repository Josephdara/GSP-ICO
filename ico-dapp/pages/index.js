import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Web3Modal } from "web3modal";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [walletConnected, setWalletConnect] = useState(false);
  const web3ModalRef = useRef();

  async function connectWallet() {
    try {
      await getProviderOrSigner();
      setWalletConnect(true);
    } catch (error) {
      console.error(erroe);
    }
  }
  async function getProviderOrSigner(needSigner = false) {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new provider.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("You need to be on Goerli");
      throw new Error("You need to be on Goerli");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, []);

  return (
    <div>
      <Head>
        <title> Glory Sound Token ICO</title>
        <meta name="description" content="GST ICO" />
      </Head>
      <div className={style.main}>
        <div>
          <h1 className={style.title}>Welcome to Glory Sound Token</h1>
          <div className={style.description}>
            NFT owners can claim, New users can mint GST{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
