// eslint-disable-next-lin
import { erc20ABI, erc721ABI, useAccount, useConfig, useConnect, useNetwork, useSwitchNetwork, useWalletClient } from 'wagmi';
import React, { useState } from 'react';
import { ethers } from 'ethers';
// import { privateKeyToAccount } from 'viem/accounts';
import { getContract } from 'viem';
import { getWalletClient } from '@wagmi/core';

const ABI_List = [
  { name: 'ERC721', abi: erc721ABI },
  { name: 'ERC20', abi: erc20ABI },
];

const ABIIIIII = erc20ABI; // ['function DEFAULT_ADMIN_ROLE() view returns (bytes32)'];

export const IndexPage = () => {
  const { address, isConnected } = useAccount();
  const conn = useConnect();
  const confs = useConfig();
  const net = useNetwork();
  const snet = useSwitchNetwork();
  const [tool, _tool] = useState('1e18');
  const wallet = useWalletClient();
  const [abi, _abi] = useState(ABI_List[0]);
  const [tool2, _tool2] = useState('1000000000000000000');

  if (!address) return <button onClick={() => conn.connect({ connector: conn.connectors[0] })}>Connect Wallet</button>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 20, padding: 20 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        <div>
          ChainId: <input style={{ width: 100 }} placeholder="chainId" id="chainId" />
          <button
            onClick={() => {
              const chainId = document.getElementById('chainId');
              snet.switchNetwork(parseInt(chainId.value));
            }}
          >
            set
          </button>
        </div>
        {confs.chains.map((chain) => (
          <button style={{ color: chain.id === net.chain?.id ? '#f09' : '#000' }} key={chain.id} onClick={() => snet.switchNetwork(chain.id)}>
            {chain.name}
          </button>
        ))}
      </div>

      <div>
        calldata:
        <input style={{ width: 100 }} placeholder="calldata" id="calldata" />
        <button
          onClick={async () => {
            if (!wallet.data) return alert('!wallet');
            // const to = '0x000';
            // const rpccc = '';
            // const acc = ethers.Wallet.createRandom(new ethers.JsonRpcProvider(rpccc));
            // const rewardContract = new ethers.Contract(to, ABIIIIII, acc);
            // const data = rewardContract.interface.encodeFunctionData('transfer', ['', '']);
            // console.log({ to, data, address: acc.address });
            wallet.data.account.signTransaction(JSON.parse(document.getElementById('calldata').value));
          }}
        >
          call
        </button>
      </div>
      <div>
        Tool:{' '}
        <input
          placeholder="1e4"
          value={tool}
          onInput={(v) => {
            const newVal = v.target.value || '';
            _tool(newVal);
            const nums = newVal.split('e');
            console.log(nums);
            if (nums.length !== 2) return;
            const n1 = parseFloat(nums[0]);
            const n2 = parseInt(nums[1]);
            if (isNaN(n1) || isNaN(n2)) return;
            const result = (ethers.parseEther(nums[0]) * 10n ** BigInt(n2)) / ethers.WeiPerEther;
            _tool2(result.toString());
          }}
        />{' '}
        is <i>{tool2}</i>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        ABI:
        {ABI_List.map((a) => (
          <button style={{ color: a === abi ? '#f09' : '#000' }} key={a.name} onClick={() => _abi(a)}>
            {a.name}
          </button>
        ))}
      </div>
      <div>
        To: <input style={{ width: 400 }} placeholder="0xxxxx" id="to" />
      </div>
      <div>
        function: <input defaultValue="transferFrom" placeholder="0xxxxx" id="fun" />
      </div>

      <div>
        Args: <textarea style={{ minWidth: 500, minHeight: 300 }} placeholder="[1, 'sss']" id="args" />
      </div>
      <div>
        value: <input placeholder="0.1" id="value" />
      </div>
      <div>
        <button
          onClick={async () => {
            if (!wallet.data) return alert('!wallet');
            const walletClient = await getWalletClient({
              chainId: wallet.data.chain.id,
            });
            const address = document.getElementById('to').value.trim();
            if (!address || !ethers.isAddress(address)) alert('not address');
            const to = getContract({ address: address, abi: abi.abi, walletClient });
            const value = ethers.parseEther(document.getElementById('value').value.trim() || '0');
            const fun = document.getElementById('fun').value.trim();
            const argsVal = document.getElementById('args').value.trim();
            const toArgs = [{ value }];
            if (argsVal) toArgs.unshift(JSON.parse(argsVal));
            try {
              const estimateGas = await to.estimateGas[fun](...toArgs);
              const tx = await to.write[fun](...toArgs);
            } catch (e) {
              alert(String(e));
            }
          }}
        >
          send
        </button>
      </div>
    </div>
  );
};
