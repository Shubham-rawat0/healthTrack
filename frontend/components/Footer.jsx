export default function Footer({ goal }) {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Company Info */}
        <div style={styles.section}>
          <h3 style={styles.heading}>HealthTrack Inc.</h3>
          <p style={styles.text}>
            Leading the way in fitness tracking and wellness solutions.
          </p>
          <p style={styles.text}>
            Goal:{" "}
            <span style={{ fontWeight: 500 }}>
              {goal || "Fit and healthy!"}
            </span>
          </p>
        </div>

        {/* Links section (fake, not clickable) */}
        <div style={styles.section}>
          <h4 style={styles.subheading}>Products</h4>
          <p style={styles.text}>Workout Tracker</p>
          <p style={styles.text}>Meal Planner</p>
          <p style={styles.text}>AI Recommendations</p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.subheading}>Company</h4>
          <p style={styles.text}>About Us</p>
          <p style={styles.text}>Careers</p>
          <p style={styles.text}>Blog</p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.subheading}>Support</h4>
          <p style={styles.text}>Help Center</p>
          <p style={styles.text}>Terms of Service</p>
          <p style={styles.text}>Privacy Policy</p>
        </div>
      </div>

      <div style={styles.bottom}>
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} HealthTrack Inc. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#111",
    color: "#fff",
    width: "100%",
    marginTop: "2rem",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    padding: "2rem 1rem",
    flexWrap: "wrap",
  },
  section: {
    minWidth: "150px",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
  subheading: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
    fontWeight: "500",
  },
  text: {
    fontSize: "0.9rem",
    margin: "0.2rem 0",
    color: "#ccc",
  },
  bottom: {
    textAlign: "center",
    padding: "1rem",
    borderTop: "1px solid #333",
    fontSize: "0.8rem",
    color: "#aaa",
  },
};
