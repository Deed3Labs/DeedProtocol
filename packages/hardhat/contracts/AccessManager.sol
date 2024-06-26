// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract AccessManager is AccessControlUpgradeable {
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    uint256[48] __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin) public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /**
     * Use this modifier to manage the fonction access more granularly
     * @param _functionSig The signature of the function to be called
     */
    modifier functionRoleOrAdmin(bytes32 _functionSig) {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()) || hasRole(_functionSig, _msgSender()),
            "[AccessManagement] Only the Admin or function granted user can interact"
        );
        _;
    }

    /**
     * @dev Add a validator to the contract
     */
    function addValidator(address _validator) public functionRoleOrAdmin(this.addValidator.selector) {
        _grantRole(VALIDATOR_ROLE, _validator);
    }

    /**
     * @dev Remove a validator from the contract
     */
    function removeValidator(address _validator) public functionRoleOrAdmin(this.removeValidator.selector) {
        _revokeRole(VALIDATOR_ROLE, _validator);
    }

    /**
     * @dev Check if an address has the admin role
     */
    function hasAdminRole(address _address) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, _address);
    }

    /**
     * @dev Check if an address has the validator role
     * @param _address The address to check
     */
    function hasValidatorRole(address _address) public view returns (bool) {
        return hasRole(VALIDATOR_ROLE, _address);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 _interfaceId
    ) public view virtual override(AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }
}

contract AccessManagerBase is ContextUpgradeable {
    AccessManager accessManager;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _accessManager) public virtual initializer {
        accessManager = AccessManager(_accessManager);
    }

    /**
     * Use this modifier to restrict to admin only
     */
    modifier onlyAdmin() {
        require(
            accessManager.hasRole(accessManager.DEFAULT_ADMIN_ROLE(), _msgSender()),
            "[AccessManagement] Only the admin can interact"
        );
        _;
    }

    /**
     * Use this modifier to restrict to validator only
     */
    modifier onlyValidator() {
        require(
            accessManager.hasRole(accessManager.VALIDATOR_ROLE(), _msgSender()),
            "[AccessManagement] Only the validator can interact"
        );
        _;
    }

    /**
     * Use this modifier to restrict to validator only
     */
    modifier onlyAgent() {
        require(
            accessManager.hasRole(accessManager.AGENT_ROLE(), _msgSender()),
            "[AccessManagement] Only the agent can interact"
        );
        _;
    }

    /**
     * Use this modifier to manage the fonction access more granularly
     */
    modifier onlyRole(bytes32 _role) {
        require(accessManager.hasRole(_role, _msgSender()), "[AccessManager] Only the validator can interact");
        _;
    }

    /**
     * Use this modifier to manage the fonction access more granularly
     * @param _functionSig The signature of the function to be called
     */
    modifier functionRoleOrAdmin(bytes32 _functionSig) {
        require(
            hasRole(accessManager.DEFAULT_ADMIN_ROLE(), _msgSender()) || hasRole(_functionSig, _msgSender()),
            "[AccessManagement] Only the Admin or function granted user can interact"
        );
        _;
    }

    function hasAdminRole() public view returns (bool) {
        return accessManager.hasAdminRole(_msgSender());
    }

    function hasValidatorRole() public view returns (bool) {
        return accessManager.hasValidatorRole(_msgSender());
    }

    function hasRole(bytes32 _role, address _address) public view returns (bool) {
        return accessManager.hasRole(_role, _address);
    }
}
