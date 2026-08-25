import Link from "next/link";
import { practices } from "@/content/practices";
import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <span className="brand">
              <span className="brand__name">Nectar</span>
              <span className="brand__suffix">Consultancy</span>
            </span>
            <p className="small" style={{ maxWidth: "34ch", marginTop: 16 }}>
              A trading name of {site.entity}. Business solutions, process
              optimisation and regulatory compliance for Australian
              organisations.
            </p>
          </div>

          <div>
            <h4>Practices</h4>
            <ul>
              {practices.map((p) => (
                <li key={p.slug}>
                  <Link href={`/what-we-do/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Firm</h4>
            <ul>
              <li><Link href="/sectors">Sectors</Link></li>
              <li><Link href="/how-we-work">How we work</Link></li>
              <li><Link href="/evidence">Evidence</Link></li>
              <li><Link href="/firm">About the firm</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms of engagement</Link></li>
              <li><Link href="/accessibility">Accessibility</Link></li>
              <li><span className="micro">{site.abn}</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {site.entity}. All rights reserved.</span>
          <span>Registered in Australia · en-AU</span>
        </div>
      </div>
    </footer>
  );
}
