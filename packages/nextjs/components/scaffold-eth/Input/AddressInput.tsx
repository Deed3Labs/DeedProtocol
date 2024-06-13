import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { blo } from "blo";
import { useDebounce } from "usehooks-ts";
import { Address, isAddress } from "viem";
import { useEnsAddress, useEnsAvatar, useEnsName } from "wagmi";
import { CommonInputProps, InputBase, isENS } from "~~/components/scaffold-eth";
import useWallet from "~~/hooks/useWallet";

/**
 * Address input with ENS name resolution
 */
export const AddressInput = ({
  value,
  name,
  placeholder,
  onChange,
  disabled,
  className = "",
  large = false,
}: CommonInputProps<Address | string>) => {
  // Debounce the input to keep clean RPC calls when resolving ENS names
  // If the input is an address, we don't need to debounce it
  const _debouncedValue = useDebounce(value, 500);
  const debouncedValue = isAddress(value) ? value : _debouncedValue;
  const isDebouncedValueLive = debouncedValue === value;
  const { primaryWallet } = useWallet();
  // If the user changes the input after an ENS name is already resolved, we want to remove the stale result
  const settledValue = isDebouncedValueLive ? debouncedValue : undefined;

  const { data: ensAddress, isLoading: isEnsAddressLoading } = useEnsAddress({
    name: settledValue,
    enabled: isENS(debouncedValue),
    chainId: 1,
    cacheTime: 30_000,
  });

  const [enteredEnsName, setEnteredEnsName] = useState<string>();
  const { data: ensName, isLoading: isEnsNameLoading } = useEnsName({
    address: settledValue,
    enabled: isAddress(debouncedValue),
    chainId: 1,
    cacheTime: 30_000,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    enabled: Boolean(ensName),
    chainId: 1,
    cacheTime: 30_000,
  });

  // ens => address
  useEffect(() => {
    if (!ensAddress) return;

    // ENS resolved successfully
    setEnteredEnsName(debouncedValue);
    onChange(ensAddress);
  }, [ensAddress, onChange, debouncedValue]);

  const handleChange = useCallback(
    (newValue: Address) => {
      setEnteredEnsName(undefined);
      onChange(newValue);
    },
    [onChange],
  );

  function onBlockieClicked(): void {
    if (!value && primaryWallet?.address) {
      onChange(primaryWallet.address);
    }
  }

  return (
    <InputBase<Address>
      name={name}
      placeholder={placeholder}
      error={ensAddress === null}
      value={value}
      className={`w-fit sm:w-auto ${className}`}
      onChange={handleChange}
      disabled={isEnsAddressLoading || isEnsNameLoading || disabled}
      large={large}
      prefix={
        ensName && (
          <div className="flex items-center">
            {ensAvatar ? (
              <span className="w-[25px]">
                {
                  // eslint-disable-next-line
                  <img
                    className="w-full rounded-full"
                    src={ensAvatar}
                    alt={`${ensAddress} avatar`}
                  />
                }
              </span>
            ) : null}
            <span className="text-accent items-center px-2">{enteredEnsName ?? ensName}</span>
          </div>
        )
      }
      suffix={
        // Don't want to use nextJS Image here (and adding remote patterns for the URL)
        // eslint-disable-next-line @next/next/no-img-element
        (value || primaryWallet?.address) && (
          <Image
            alt=""
            className={`!rounded-full mx-2 ${!value ? "cursor-pointer" : ""}`}
            src={blo((value || primaryWallet?.address) as `0x${string}`)}
            width="25"
            height="25"
            title={!value ? "Click for current wallet" : "Address Blockie"}
            onClick={onBlockieClicked}
          />
        )
      }
    />
  );
};
