export interface FeesModel {
  global_automatedRoyalties?: boolean;
  global_normalizeRoyalties?: boolean;
  global_marketplaceFees?: string[];

  list_normalizeRoyalties?: boolean;
  list_enableOnChainRoyalties?: boolean;
  list_feesBps?: string[];

  editList_enableOnChainRoyalties?: boolean;
  editList_normalizeRoyalties?: boolean;

  cancelList_normalizeRoyalties?: boolean;

  buy_feesOnTopBps?: string[];
  buy_feesOnTopUsd?: string[];
  buy_normalizeRoyalties?: boolean;

  bid_feesBps?: string[];
  bid_normalizeRoyalties?: boolean;

  acceptBid_feesOnTopBps?: string[];
  acceptBid_normalizeRoyalties?: boolean;

  editBid_enableOnChainRoyalties?: boolean;
  editBid_normalizeRoyalties?: boolean;

  cancelBid_normalizeRoyalties?: boolean;
}
