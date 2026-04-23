export function Hero() {
  return (
    <div className="col-span-12 lg:col-span-8 flex flex-col justify-between gap-14">
      <div>
        <p className="eyebrow mb-8">Edition I · A Moral Cartography</p>

        <h1 className="display">
          <span className="block">BLACK</span>
          <span className="block pl-[14%]">
            <span className="italic-accent" style={{ fontSize: "0.7em" }}>
              or{" "}
            </span>
            <span
              style={{
                background: "var(--fg)",
                color: "var(--bg)",
                padding: "0.02em 0.12em 0.08em",
                display: "inline-block",
                lineHeight: 0.82,
              }}
            >
              WHITE
            </span>
          </span>
          <span
            className="block italic-accent pl-[6%] mt-3"
            style={{
              fontSize: "clamp(1.6rem, 0.6rem + 5vw, 4.5rem)",
              lineHeight: 1,
            }}
          >
            — how gray are you.
          </span>
        </h1>
      </div>

      <div className="max-w-[56ch] flex flex-col gap-7">
        <p style={{ fontSize: "var(--step-1)", lineHeight: 1.35 }}>
          Everyone lives in the gray area. Tax workarounds, weed, speeding,
          civil disobedience, piracy, white lies, tomorrow&rsquo;s laws judged
          today.{" "}
          <span className="italic-accent">
            Finance bro, vegan anarchist, average Joe, or somewhere no
            one&rsquo;s named yet
          </span>{" "}
          — this measures how much of the gray you operate in.
        </p>

        <p
          style={{
            fontSize: "var(--step-0)",
            lineHeight: 1.45,
            opacity: 0.75,
          }}
        >
          Questions from criminal law and international treaties. A shade. A
          color code. A place on the spectrum. Not a verdict.
        </p>

        <p className="eyebrow" style={{ opacity: 0.65 }}>
          Nothing leaves this device.
        </p>
      </div>
    </div>
  );
}
