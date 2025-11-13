import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    justifyContent: 'center',
    
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
        fontWeight: "bold",
        marginBottom: 40,
        textAlign: "center",
  },
  input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
        color: "#776e6eff",
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupLink: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
    textAlign: "center",
  },
  signupText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
    name: {
        fontSize: 17,
        marginBottom: 5,
        textAlign: "left",
    },
});
