import { BigNumber, Contract, utils } from "ethers";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Web3Modal } from "web3modal";
import { GSP_CONTRACT_ABI, GST_CONTRACT_ADDRESS } from "../constant";
import styles from "../styles/Home.module.css";

export default function Home() {
  const zero = BigNumber.from(0);
  const [tokenMinted, setTokenMinted] = useState(zero);
  const [walletConnected, setWalletConnect] = useState(false);
  const [balanceOfGSP, setBalanceOfGSP] = useState(zero);
  const [tokenAmount, setTokenAmount] = useState(zero);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  async function connectWallet() {
    try {
      await getProviderOrSigner();
      setWalletConnect(true);
    } catch (error) {
      console.error(error);
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
  async function getGSPBalance() {
    try {
      const signer = await getProviderOrSigner(true);
      const GSTContract = new Contract(
        GST_CONTRACT_ADDRESS,
        GSP_CONTRACT_ABI,
        signer
      );
      const address = await signer.getAddress();
      const balance = await GSTContract.balanceOf(address);
      setBalanceOfGSP(balance)
    } catch (error) {
      console.error(error);
    }
  }
  async function getTotalMinted() {
    try {
      const provider = await getProviderOrSigner();
      const GSTContract = new Contract(
        GST_CONTRACT_ADDRESS,
        GSP_CONTRACT_ABI,
        provider
      );

      const balance = await GSTContract.totalSupply();
      setTokenMinted(getTotalMinted)
    } catch (error) {
      console.error(error);
    }
  }
  async function mintGST(amount) {
    try {
      const signer = await getProviderOrSigner(true);
      const GSTContract = new Contract(
        GST_CONTRACT_ADDRESS,
        GSP_CONTRACT_ABI,
        signer
      );
      const value = 0.005 * amount;
      const tx = await GSTContract.mint(amount, {
        value: utils.parseEther(value.toString()),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("Welcome, You now own Glory Sound Tokens");
      await getGSPBalance();
      await getTotalMinted();
    } catch (error) {
      console.error(error);
    }
  }
  async function renderButton() {
    return (
      <div className={{ display: "flex-col" }}>
        <div>
          <input
            type="number"
            placeholder="Amount of Tokens"
            onChange={(e) => {
              setTokenAmount(BigNumber.from(e.target.value));
            }}
          />
          <button
            className={styles.button}
            disabled={!(tokenAmount > 0)}
            onClick={() => mintGST(tokenAmount)}
          >
            {" "}
            Mint Token{" "}
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
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
          {walletConnected ? (
            <div>
              <div className={styles.description}>
                You have Minted {utils.formatEther(balanceOfGSP)} GSP
              </div>
              <div className={styles.description}>
                {utils.formatEther(tokenMinted)} GSP have been minted
              </div>
              {renderButton()}
            </div>
          ) : (
            <button className={styles.button} onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
