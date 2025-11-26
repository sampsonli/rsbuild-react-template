import {define, Model} from 'mtor';
import * as Comlink from 'comlink';
import {
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    address,
    generateKeyPair,
    airdropFactory,
    lamports, generateKeyPairSigner
} from '@solana/kit';

@define(module)
class DemoModel extends Model {
    /**
     *
     * @type {{rpc, rpcSubscriptions}}
     */
    static client = undefined;
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
        const {rpc} = DemoModel.client;

        const myaddr = address('6P4nuQcveqL8TbssGdRh82qjf6SrmERdn8ieM7hfUmse')

        const airdrop = airdropFactory(DemoModel.client);
        /*await airdrop({
            recipientAddress: myaddr,
            lamports: lamports(5_000_000_000n),
            commitment: 'confirmed',
        });*/
        const w = await generateKeyPairSigner();
        console.log(w);


        const {value} = await rpc.getBalance(myaddr).send();
       // console.log(typeof value)
        this.balance = Number( value)/ 1e9;



        const work = new Worker(new URL('./mywork.js', import.meta.url));
        DemoModel.work_proxy = Comlink.wrap(work);
        this.onBeforeReset(() => {
            work.terminate();
            DemoModel.work_proxy.releaseProxy();


        });
        this.loaded = true;
    }


}

export default DemoModel;
