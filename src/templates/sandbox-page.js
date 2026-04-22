import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const DEFAULT_INSTRUQT_EMBED_URL =
  "https://play.instruqt.com/embed/strata/tracks/getting-started-with-identity-controls-for-ai-agents";
const DEFAULT_INSTRUQT_TOKEN = "em_5TNjcEwxGDgqL2zv";

// Whitelisted redirect host — any resolved embed URL must point here.
// Prevents an env-misconfiguration from turning this into an open-redirect.
const ALLOWED_INSTRUQT_HOST = "play.instruqt.com";

const INSTRUQT_EMBED_URL =
  process.env.GATSBY_INSTRUQT_EMBED_URL || DEFAULT_INSTRUQT_EMBED_URL;
const INSTRUQT_TOKEN =
  process.env.GATSBY_INSTRUQT_TOKEN || DEFAULT_INSTRUQT_TOKEN;

// RSA public key used by Instruqt to decrypt `pii_tpg`. A public key is safe to
// commit; it's already published in the live page HTML. Kept inline because
// multi-line secrets don't round-trip cleanly through .env files and this value
// is not sensitive.
const PII_PUBLIC_KEY = `-----BEGIN RSA PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA2eMOBbavyTfk8y48h6zT
njkTPPdM+zmD0mGBOaKzU8pkoHLNwOvhsmcpY9eeaR2f060KyYb943MPZd6xlpO9
ChVLgkv3ET7/caJUZAZ61Zh5VG4YcJeFNd4gaBrEtV0O8EQcDNCr46UrAmkO8+32
ttHMvKmRK+JBR4c+JGdiTvpUZ3+Ik/YcCvo5WMAXLW5mSKcvbsSNuDvsNsYwBR6z
5o5itxYnL8hXGwW/YTpPw/fZMwJOHEMq8/iIWcp0ec/N91MvBQQsDKxr6oPyZVwW
E5lHkl2+7CjkePUP2OeNQZJTQx1oCVLgeDJ7krJMlWkXqVLc9bgaEfPuPS1GIAKG
nLjwx7NKg0eXFUk6wtXYZo3RHVBP49zg1ZvWYYeIazV6elDlWz/Nxwa8SZPQ84I7
xjMZrvqocTqxUK9IUBho/L0PXEnvXgCQEaWiz4WyRrmHoMDqzxHs7opZKeAjEo+Y
5EUcIof1dmdrhouJk5vYdtbcgujTAwXWfXTY54jZRigzlrm8Oq9+cpktlUIuQRN8
pDl7b+/T6vyLmm77PmgkatcFgSRxkhGIYY7/3+B9A7QYXIrW8VFd7g3eOTj650hD
+TmCFAOiOByH7z2eLo+BrWUeTf/tnnMdNH6y8ZXmgBUAFZABtEGoyTfPJZL4KFBV
b50ioy9JIuuXv9QH/+3tvXcCAwEAAQ==
-----END RSA PUBLIC KEY-----`;

const MAX_FIELD_LENGTH = 254;

function sanitizeField(value) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function buildTrackUrl(encryptedPII) {
  const trackUrl = new URL(INSTRUQT_EMBED_URL);
  if (trackUrl.hostname !== ALLOWED_INSTRUQT_HOST) {
    throw new Error("Refusing redirect: host not allow-listed");
  }
  trackUrl.searchParams.set("token", INSTRUQT_TOKEN);
  if (encryptedPII) {
    trackUrl.searchParams.set("pii_tpg", encryptedPII);
  }
  return trackUrl.toString();
}

async function encryptPII(publicKeyPEM, fields) {
  const encodedPII = new TextEncoder().encode(
    new URLSearchParams(
      [
        ["fn", fields.firstName],
        ["ln", fields.lastName],
        ["e", fields.email],
      ].filter(([, value]) => value)
    ).toString()
  );

  const publicKeyDER = Uint8Array.from(
    atob(publicKeyPEM.replace(/-----[^-]+-----|\s/g, "")),
    (char) => char.charCodeAt(0)
  );

  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    publicKeyDER,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const encryptedPII = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encodedPII
  );

  return btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedPII)))
  );
}

async function launchTrack(firstName, lastName, email) {
  const loadingEl =
    typeof document !== "undefined"
      ? document.getElementById("loading")
      : null;
  try {
    if (loadingEl) loadingEl.classList.remove("hidden");

    const encryptedPII = await encryptPII(PII_PUBLIC_KEY, {
      firstName: sanitizeField(firstName),
      lastName: sanitizeField(lastName),
      email: sanitizeField(email),
    });

    window.location.href = buildTrackUrl(encryptedPII);
  } catch (error) {
    console.error("Failed to launch Instruqt track:", error && error.name);
    if (loadingEl) loadingEl.classList.add("hidden");
    try {
      window.location.href = buildTrackUrl(null);
    } catch (fallbackError) {
      console.error(
        "Fallback redirect blocked:",
        fallbackError && fallbackError.name
      );
    }
  }
}

const SandboxPageTemplate = ({ title, heading, description, learnItems }) => {
  const hasLaunchedRef = useRef(false);

  useEffect(() => {
    const handleHubSpotMessage = (event) => {
      // HubSpot's v2 embed script posts these messages from the current window,
      // so the only legitimate origin is our own. Reject anything else to block
      // third-party scripts from triggering a spoofed redirect.
      if (event.origin !== window.location.origin) return;

      const payload = event.data;
      if (
        !payload ||
        typeof payload !== "object" ||
        payload.type !== "hsFormCallback" ||
        payload.eventName !== "onFormSubmitted"
      ) {
        return;
      }

      if (hasLaunchedRef.current) return;
      hasLaunchedRef.current = true;

      const submissionValues =
        (payload.data && payload.data.submissionValues) || {};
      launchTrack(
        submissionValues.firstname,
        submissionValues.lastname,
        submissionValues.email
      );
    };
    window.addEventListener("message", handleHubSpotMessage);

    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    script.async = true;
    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "6226005",
          formId: "4dd23cd3-4182-420c-b3b0-1cb85556a4f2",
          region: "na1",
          target: "#hubspot-form",
          css: "",
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      window.removeEventListener("message", handleHubSpotMessage);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <section className="sandbox-section">
      <style>{`#loading.hidden{display:none;}`}</style>
      <div className="sandbox-container">
        <div className="sandbox-content">
          <p className="sandbox-eyebrow">{title}</p>
          <h1 className="sandbox-heading">{heading}</h1>
          <p className="sandbox-description">{description}</p>
          {learnItems && learnItems.length > 0 && (
            <>
              <hr className="sandbox-divider" />
              <p className="sandbox-learn-label">
                You&apos;ll learn how to:
              </p>
              <ul className="sandbox-learn-list">
                {learnItems.map((item, i) => (
                  <li key={i} className="sandbox-learn-item">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="sandbox-form-wrapper">
          <div id="hubspot-form">
            <p style={{ color: "#B0B0B0", textAlign: "center" }}>
              Loading form...
            </p>
          </div>
          <div id="loading" className="hidden" />
        </div>
      </div>
    </section>
  );
};

SandboxPageTemplate.propTypes = {
  title: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  learnItems: PropTypes.array,
};

const SandboxPage = ({ data }) => {
  const { markdownRemark: page } = data;
  return (
    <Layout>
      <SEO
        title="Maverics Sandbox for Agentic Identity | Try Free"
        description={page.frontmatter.description}
      />
      <SandboxPageTemplate
        title={page.frontmatter.title}
        heading={page.frontmatter.heading}
        description={page.frontmatter.description}
        learnItems={page.frontmatter.learnItems}
      />
    </Layout>
  );
};

SandboxPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default SandboxPage;

export const pageQuery = graphql`
  query SandboxPageByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        heading
        description
        learnItems
      }
    }
  }
`;
