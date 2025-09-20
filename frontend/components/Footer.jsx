export default function Footer({ goal }) {
  return (
    <footer style={styles.footer}>
      <p>
        <span style={{ fontWeight: "500" }}>Goal:</span> {goal || "Fit and healthy!"}
      </p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#000",
    textAlign: "center",
    padding: "1rem",
    width: "100%",
    color: "white",
  },
};
