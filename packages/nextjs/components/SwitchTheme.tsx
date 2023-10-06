// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SwitchTheme = ({ className }: { className?: string }) => {
  // const { isDarkMode, toggle } = useDarkMode();
  // const isMounted = useIsMounted();

  // useEffect(() => {
  //   const body = document.body;
  //   body.setAttribute("data-theme", isDarkMode ? "scaffoldEthDark" : "scaffoldEth");
  // }, [isDarkMode]);

  return (
    <></>
    // Only support dark mode for now
    // <div className={`flex space-x-2 text-sm ${className}`}>
    //   <input
    //     id="theme-toggle"
    //     type="checkbox"
    //     className="toggle toggle-primary bg-primary"
    //     onChange={toggle}
    //     checked={isDarkMode}
    //   />
    //   {isMounted() && (
    //     <label htmlFor="theme-toggle" className={`swap swap-rotate ${!isDarkMode ? "swap-active" : ""}`}>
    //       <SunIcon className="swap-on h-5 w-5" />
    //       <MoonIcon className="swap-off h-5 w-5" />
    //     </label>
    //   )}
    // </div>
  );
};
