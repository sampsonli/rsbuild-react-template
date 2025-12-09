import {define, Model} from 'mtor';
import * as Comlink from 'comlink';
import {
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    address,
    airdropFactory,
    createKeyPairSignerFromBytes, createSignableMessage, lamports,
} from '@solana/kit';

@define(module)
class DemoModel extends Model {
    /**
     *
     * @type {{rpc, rpcSubscriptions}}
     */
    static client = undefined;
    myaddr = address('6P4nuQcveqL8TbssGdRh82qjf6SrmERdn8ieM7hfUmse');
    loaded = false;

    client;

    balance = 0;
    /**
     * @type {Comlink.Remote<{heavyCalculation: any}>}
     */
    static work_proxy;

    num = 10;

    async add() {
        this.num++;
        let ret = await DemoModel.work_proxy.heavyCalculation(1000);
        this.num++;
    }

    async sign() {
        const con = await window.solana.connect();

        console.log(window.solana);



        const myMessage = createSignableMessage('Hello world!');
        const keypairBytes = new Uint8Array([50,254,168,227,164,212,42,238,88,8,25,198,2,16,109,126,170,15,201,47,140,62,228,25,184,160,215,164,204,9,55,241,79,241,127,218,120,6,209,149,90,245,161,144,189,96,157,163,23,121,158,88,94,198,6,190,173,151,221,99,189,138,203,193]);

        const signer = await createKeyPairSignerFromBytes(keypairBytes);
        const [myMessageSignatures] = await signer.signMessages([myMessage]);
        console.log(myMessageSignatures);

        console.log(await window.solana.signMessage(new Uint8Array("hello world!")));

    }

    async getBalance() {
        const {rpc} = DemoModel.client;


       /* const airdrop = airdropFactory(DemoModel.client);
        await airdrop({
            recipientAddress: this.myaddr,
            lamports: lamports(5_000_000_000n),
            commitment: 'confirmed',
        });*/

        const {value} = await rpc.getBalance(this.myaddr).send();
        this.balance = Number( value)/ 1e9;
    }

    async init() {
        if (this.loaded) {
            return;
        }
        if(!DemoModel.client) {
            DemoModel.client = {
                rpc: createSolanaRpc('https://api.devnet.solana.com'),
                rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.devnet.solana.com'),
            };
        }


        const work = new Worker(new URL('./mywork.js', import.meta.url));
        DemoModel.work_proxy = Comlink.wrap(work);
        this.onBeforeReset(() => {
            work.terminate();
            DemoModel.work_proxy.releaseProxy();


        });
        this.getBalance();
        this.loaded = true;
    }


}

export default DemoModel;
