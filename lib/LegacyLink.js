// Global wrapper to force legacyBehavior on all next/link usage
// This prevents "Invalid <Link> with <a> child" SSR errors
import NextLink from "next/dist/client/link";

export default function LegacyLink(props) {
    return <NextLink legacyBehavior {...props} />;
}
