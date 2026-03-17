const mysql = require('mysql2/promise');

const javaQuestions = {
  easy: [
    ["What is Java?", "A coffee brand", "A high-level, class-based, object-oriented programming language", "A low-level operating system", "A database engine", "B"],
    ["Who invented Java?", "James Gosling", "Bjarne Stroustrup", "Guido van Rossum", "Dennis Ritchie", "A"],
    ["Which primitive data type is typically used for a single 16-bit Unicode character?", "char", "String", "byte", "short", "A"],
    ["Which keyword is used to declare a constant variable in Java?", "const", "final", "static", "let", "B"],
    ["What is the size of an int in Java?", "8-bit", "16-bit", "32-bit", "64-bit", "C"],
    ["What is the correct syntax for the main method?", "public static void main(String args[])", "public void main(String args[])", "static void main(String args)", "int main()", "A"],
    ["Which statement is used to stop a loop?", "stop", "exit", "return", "break", "D"],
    ["How do you start a multi-line comment?", "/*", "//", "<!--", "#", "A"],
    ["What does JVM stand for?", "Java Variable Manager", "Java Virtual Machine", "Just Virtual Memory", "Java Versatile Module", "B"],
    ["What does 'public' mean in Java?", "Visible everywhere", "Visible to the class only", "Visible to the package only", "Visible to subclasses only", "A"],
    ["What happens if you try to divide a number by 0 natively (e.g. 5 / 0)?", "Infinity", "0", "ArithmeticException is thrown", "NaN", "C"],
    ["Which operator is used to compare object values (not references) properly for Strings?", "==", "equals()", "compare", "=", "B"],
    ["How do you create an object of a class 'MyClass'?", "MyClass obj = new MyClass();", "MyClass obj();", "MyClass obj = create MyClass();", "obj: MyClass", "A"],
    ["Which data type is used to create a variable that should store text?", "String", "Txt", "string", "Text", "A"],
    ["What is an array in Java?", "A single variable", "A collection of similar type variables referenced by a common name", "A dynamic list of multiple types", "A database table", "B"],
    ["How do you find the length of a string 'txt'?", "txt.size()", "txt.length()", "txt.length", "len(txt)", "B"],
    ["What is the index of the first element in a Java array?", "1", "0", "-1", "Depends on array type", "B"],
    ["Which package contains the Scanner class?", "java.net", "java.io", "java.util", "java.awt", "C"],
    ["Which loop is guaranteed to execute at least once?", "for", "while", "do-while", "foreach", "C"],
    ["What is a constructor?", "A special method used to initialize objects", "A database connector", "A tool to build UI", "A memory manager", "A"],
    ["What is the default value of a boolean variable?", "null", "undefined", "true", "false", "D"],
    ["Which keyword is used to inherit a class?", "super", "this", "implements", "extends", "D"],
    ["Which method can be defined only once in a program?", "main method", "toString", "constructor", "finalize", "A"],
    ["What is the symbol for logical AND?", "&&", "||", "&", "AND", "A"],
    ["Which data type takes 8 bytes of memory?", "int", "boolean", "float", "double", "D"]
  ],
  medium: [
    ["What is the difference between specific interface implementation and inheritance?", "Classes implements an interface; extends another class", "Classes extends an interface", "Classes inherit an interface", "No difference", "A"],
    ["What is the difference between ArrayList and LinkedList?", "ArrayList uses a dynamic array; LinkedList uses a doubly linked list", "LinkedList is faster for random access", "ArrayList is synchronized", "No difference", "A"],
    ["What does the 'static' keyword mean?", "The variable/method belongs to the class, rather than instances of the class", "The value cannot be changed", "The variable is accessible from all classes", "The method cannot be overridden", "A"],
    ["What is polymorphism in Java?", "Hiding inner details", "A single action performed in different ways (method overloading/overriding)", "Classes inheriting from multiple classes", "Wrapping data and methods", "B"],
    ["What is a NullPointerException?", "An exception when a pointer becomes negative", "An exception thrown when an application attempts to use an object reference that has the null value", "A database error", "A compiler error", "B"],
    ["What is the difference between Abstract Class and Interface?", "Abstract class can have state and non-abstract methods; Interfaces historically (pre-Java 8) only contain abstract methods and final variables", "Interfaces can hold state", "Abstract classes support multiple inheritance", "No difference", "A"],
    ["How do you throw a manual exception?", "raise exception", "throw new Exception()", "Exception.throw()", "catch exception", "B"],
    ["What is 'super' keyword used for?", "To refer to the parent class object", "To break a loop", "To declare a super class", "To make a variable static", "A"],
    ["What is method overloading?", "Defining multiple methods with the same name but different parameters in the same class", "Providing a specific implementation of a method provided by a superclass", "Loading too many methods in memory", "An error", "A"],
    ["What is method overriding?", "Defining multiple methods with same name", "Providing a specific implementation in a subclass of a method already provided by its superclass", "Calling a method too fast", "Overwriting memory", "B"],
    ["What does the garbage collector do?", "Deletes .class files", "Automatically reclaims memory occupied by objects that are no longer referenced", "Checks for syntax errors", "Compiles the code", "B"],
    ["What is a thread in Java?", "A string type", "A lightweight sub-process or the smallest unit of processing", "A sewing concept", "A network connection", "B"],
    ["What is the 'synchronized' keyword?", "It stops the program", "It is used to control the access of multiple threads to any shared resource", "It synchronizes variables with the DB", "It aligns code", "B"],
    ["Which of the following is NOT a core concept of OOP?", "Encapsulation", "Polymorphism", "Compilation", "Inheritance", "C"],
    ["What is the use of the finalize() method?", "To end the program", "Called by the garbage collector on an object when garbage collection determines no more references to the object exist", "To compile the object", "To print final output", "B"],
    ["What is the difference between == and .equals() for objects?", "== compares memory location; .equals() compares the actual content/value (if overridden)", "== compares value; .equals compares reference", "They are identical", "== is for strings only", "A"],
    ["What happens if you don't handle a checked exception?", "The code will not compile", "The JVM handles it at runtime", "It is ignored silently", "It runs forever", "A"],
    ["Which Collection class allows null elements and null keys?", "HashMap", "Hashtable", "TreeMap", "ConcurrentHashMap", "A"],
    ["What does the 'transient' keyword do?", "Makes a variable change fast", "Indicates that a field should not be serialized", "Makes a method run in the background", "Creates a temporary class", "B"],
    ["What is autoboxing?", "Automatic styling of text boxes", "The automatic conversion of primitive types to their corresponding object wrapper classes", "Boxing a UI element", "A compiler optimization", "B"],
    ["What is the purpose of the Collections.sort() method?", "Sorts a database table", "Sorts the specified list into ascending order, according to the natural ordering of its elements", "Sorts arrays only", "Randomizes the collection", "B"],
    ["What is a lambda expression in Java?", "A mathematical symbol", "A short block of code which takes parameters and returns a value, introduced in Java 8 to implement functional interfaces", "A Greek letter variable type", "A database query", "B"],
    ["What does 'this' refer to?", "The current object in a method or constructor", "The parent class", "The JVM instance", "The file itself", "A"],
    ["Can a class extend multiple classes in Java?", "Yes", "No, Java supports single inheritance for classes to avoid the Diamond Problem", "Only abstract classes", "Only if they are in the same package", "B"],
    ["What is the return type of the hashCode() method?", "String", "long", "int", "boolean", "C"]
  ],
  hard: [
    ["What is the main difference between Volatile and Synchronized?", "Volatile guarantees visibility of changes across threads but not atomicity; Synchronized guarantees both visibility and atomicity locking", "They are exactly the same", "Volatile is for methods, Synchronized for variables", "Volatile is faster for DB access", "A"],
    ["What is the Fork/Join framework?", "A GitHub tool", "An implementation of the ExecutorService interface that helps take advantage of multiple processors via divide and conquer", "A SQL subquery", "A String manipulator", "B"],
    ["What occurs when two threads try to lock the same resource, but each holds a lock the other needs?", "Deadlock", "Livelock", "Starvation", "Race condition", "A"],
    ["What is a memory leak in Java?", "When JVM crashes", "When objects are no longer used by the application but the Garbage Collector cannot remove them because they are still referenced", "When an Array goes out of bounds", "When RAM is physically damaged", "B"],
    ["What does the ClassLoader do?", "Compiles .java to .class", "Dynamically loads Java classes into the JVM at runtime", "Deletes old classes", "Executes the main method", "B"],
    ["What are strong, soft, weak, and phantom references?", "SQL Key types", "Levels of reachability affecting how the Garbage Collector treats an object", "Network protocol headers", "Security encryption levels", "B"],
    ["How does ConcurrentHashMap achieve thread-safety?", "By locking the entire map", "By dividing the map into segments (or buckets in newer Java versions) and locking only the segment being updated", "By throwing exceptions on concurrent read", "By using a single thread", "B"],
    ["What is Double Checked Locking in Singleton?", "Locking a door twice", "A pattern to reduce synchronization overhead by only locking if the instance is null, checking it again inside the synchronized block", "A database transaction lock", "A security hash check", "B"],
    ["What is the difference between fail-fast and fail-safe iterators?", "Fail-fast throws ConcurrentModificationException if collection modified while iterating; Fail-safe works on a clone and does not throw", "They are the same", "Fail-safe shuts down the server", "Fail-fast is used only for arrays", "A"],
    ["What is a ThreadLocal variable?", "A local variable inside run()", "A variable that provides thread-local variables; each thread accessing it has its own, independently initialized copy", "A global synchronized variable", "A database connection string", "B"],
    ["What is Java Reflection API?", "A 3D graphics library", "An API that allows an executing Java program to examine or introspect upon itself and manipulate internal properties", "A network mirror", "A UI component shadowing tool", "B"],
    ["What is Type Erasure in Java Generics?", "Deleting types at runtime", "A process where the compiler translates generic types effectively to raw types (e.g., Object) to maintain backward compatibility", "Removing a class definition", "A memory optimization", "B"],
    ["Why is String immutable in Java?", "Because caching, security, synchronization, and performance depend on it", "Because it is a primitive type", "Because it has a fixed length of 256 chars", "There is no reason", "A"],
    ["What is the difference between Callable and Runnable?", "Callable can return a result and throw a checked exception; Runnable cannot", "Runnable is for UI, Callable is for DB", "No difference", "Callable is faster", "A"],
    ["What is the string pool in Java?", "A database table of strings", "A storage area in Java heap where string literals are stored and reused to save memory", "A set of random string characters", "A network buffer", "B"],
    ["What is the purpose of the CompletableFuture class?", "To represent the future of Java", "To write asynchronous, non-blocking code and chain callbacks nicely since Java 8", "To complete loops", "To close database channels", "B"],
    ["Explain the contract between hashCode() and equals().", "If two objects are equal according to equals(), they must have the same hashCode(). But same hashCode does not guarantee equals().", "They must both return the same integer", "No contract exists", "If they have the same hashCode, they are equal in equals()", "A"],
    ["What is the \"diamond problem\" and how does Java handle it?", "An ambiguity that arises with multiple inheritance; Java handles it by not allowing multiple class inheritance and enforcing specific interface default rules", "A UI rendering issue", "A multithreading deadlock issue", "A generic type bound issue", "A"],
    ["What is out-of-memory error (OOM)?", "When the DB is full", "A runtime error when the JVM cannot allocate an object because it is out of memory, and no more memory could be made available", "A compile-time syntax error", "An OS crash", "B"],
    ["What is the purpose of the 'strictfp' keyword?", "To strictly parse Ints", "To ensure that floating-point operations return exactly the same result on all platforms", "To lock a file stream", "To secure a variable", "B"],
    ["What is the 'javap' tool?", "An IDE", "The Java Class File Disassembler that prints out disassembled class bytecodes", "A compiler", "A garbage collector trigger", "B"],
    ["How do you create a custom annotation in Java?", "class @MyAnnotation {}", "public @interface MyAnnotation {}", "interface MyAnnotation {}", "public class MyAnnotation extends Annotation {}", "B"],
    ["What constitutes a memory visibility problem in threads?", "When a thread is asleep", "When one thread modifies a shared variable but the local thread cache prevents another thread from seeing the new value", "When RAM is damaged", "When the UI lags", "B"],
    ["What does the 'native' keyword mean?", "It runs fast", "It indicates that a method is implemented in native code (like C/C++) via JNI", "It is built-in to Java API", "It targets a specific OS", "B"],
    ["What is JVM Tuning?", "Tuning a guitar", "Adjusting JVM parameters like heap size, GC algorithms, and thread sizes to optimize performance", "Writing better Java code", "Upgrading the processor", "B"]
  ]
};

const cyberQuestions = {
  easy: [
    ["What does CIA stand for in cyber security?", "Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Control, Information, Access", "Cyber Information Authority", "B"],
    ["What is a firewall?", "A physical wall that stops fires", "A network security system that monitors and controls incoming and outgoing network traffic", "An antivirus program", "A password manager", "B"],
    ["What is phishing?", "Fishing with a computer", "A fraudulent attempt to obtain sensitive information like usernames and passwords by disguising as a trustworthy entity", "Hacking a database directly", "Injecting SQL", "B"],
    ["Which of the following makes a strong password?", "Your pet's name", "Your birth date", "A combination of uppercase, lowercase, numbers, and special characters", "123456", "C"],
    ["What is malware?", "Broken hardware", "Malicious software designed to disrupt, damage, or gain unauthorized access to a computer system", "A spam email", "A network switch", "B"],
    ["What does VPN stand for?", "Virtual Private Network", "Very Private Network", "Visual Prototype Node", "Virtual Processing Net", "A"],
    ["What is encryption?", "Deleting a file", "Converting information or data into a code to prevent unauthorized access", "Compressing a folder", "Sending an email", "B"],
    ["What is a DDOS attack?", "Data Delete Output System", "Distributed Denial of Service attack meant to overwhelm the target with flood of internet traffic", "Downloading documents secretly", "Decrypting passwords", "B"],
    ["What is two-factor authentication (2FA)?", "Entering your password twice", "Using two passwords", "Using two different methods to prove your identity (e.g., password + SMS code)", "Having two user accounts", "C"],
    ["What does HTTPS indicate?", "The website is slow", "The communication over the network is encrypted securely", "The website is hacked", "HyperText Terminal Protocol System", "B"],
    ["Which of these is considered PII?", "Social Security Number", "Public IP Address", "Favorite color", "Screen resolution", "A"],
    ["What is a computer virus?", "A biological disease", "A type of malicious code or program written to alter the way a computer operates and spread from one to another", "A network cable", "A hard drive failure", "B"],
    ["What does Social Engineering rely on?", "Hacking databases", "Human interaction and psychological manipulation to trick people into making security mistakes", "Brute forcing passwords", "Physical theft of laptops", "B"],
    ["What is ransomware?", "Software that makes your computer run faster", "Malware that employs encryption to hold a victim's information at ransom", "A free antivirus tool", "A method for randomizing passwords", "B"],
    ["What is a trojan horse?", "A large wooden horse", "A type of malware that is often disguised as legitimate software", "A virus that infects only emails", "A secure network protocol", "B"],
    ["What does patch management do?", "Fixes torn clothes", "The process of distributing and applying updates to software to protect against vulnerabilities", "Manages passwords", "Checks for phishing", "B"],
    ["What is an IP address?", "Internal Password", "A unique string of numbers separated by periods that identifies each computer using the Internet Protocol", "Internet Provider", "Identity Packet", "B"],
    ["What is a vulnerability?", "A hack", "A weakness in an IT system that can be exploited by an attacker", "A solid defense", "A strong password", "B"],
    ["What is a white-hat hacker?", "A malicious hacker", "An ethical hacker who identifies vulnerabilities to help organizations fix them", "A hacker who only hacks banks", "Someone who wears white hats", "B"],
    ["What does SSL stand for?", "System Secure Layer", "Secure Sockets Layer", "Secure Server Link", "Standard Security Lock", "B"],
    ["Which protocol is typically used for secure remote command-line login?", "Telnet", "FTP", "SSH", "HTTP", "C"],
    ["What is adware?", "Software that automatically displays or downloads advertising material", "A virus that deletes ads", "An ad blocker", "A secure protocol", "A"],
    ["What is 'shoulder surfing'?", "Surfing the web quickly", "Looking over someone's shoulder to steal their password or PIN", "A hacking tool", "A network scan", "B"],
    ["Why is public Wi-Fi risky?", "It uses a lot of battery", "Data transmitted over it can easily be intercepted by malicious actors if unencrypted", "It is usually slow", "It costs money", "B"],
    ["What is a brute force attack?", "Physically breaking a server", "An attacker submitting many passwords or passphrases with the hope of eventually guessing correctly", "Injecting SQL", "Tricking a user via email", "B"]
  ],
  medium: [
    ["What is the principle of least privilege?", "Giving everyone admin access", "Providing users only the minimum levels of access necessary to complete their job", "Never giving access to anyone", "Making passwords short", "B"],
    ["What is the difference between symmetric and asymmetric encryption?", "Symmetric uses one key for both encryption/decryption; Asymmetric uses a public key to encrypt and private to decrypt", "There is no difference", "Asymmetric is faster", "Symmetric uses 2 keys", "A"],
    ["What is an IDS vs an IPS?", "IDS detects intrusions but doesn't block; IPS detects and actively prevents them", "IDS is hardware, IPS is software", "They are identical", "IDS is for internal, IPS for public", "A"],
    ["What is Cross-Site Scripting (XSS)?", "A database exploit", "A vulnerability where an attacker injects malicious executable scripts into trusted websites", "A buffer overflow", "A network intercept", "B"],
    ["What happens in a SQL Injection attack?", "SQL servers crash", "Malicious SQL statements are inserted into entry fields for execution", "Passwords are brute-forced", "The network is flooded", "B"],
    ["What is a hash function?", "A function that generates a password", "A mathematical algorithm that maps data of arbitrary size to a bit string of a fixed size (a hash)", "An encryption method that is easily reversible", "A text formatter", "B"],
    ["What is the purpose of a Honeypot?", "To attract bees", "A decoy system intended to attract cyberattacks, intended to study attackers or deflect them", "A secure vault for passwords", "A network speed booster", "B"],
    ["What is a Man-in-the-Middle (MitM) attack?", "A hacker sitting in the same room", "An attacker secretly relays and possibly alters the communication between two parties who believe they are communicating directly", "A DDOS variation", "A password cracking method", "B"],
    ["What is zero-day vulnerability?", "A vulnerability discovered on day zero of the internet", "A computer-software vulnerability that is unknown to those who should be interested in mitigating it", "A virus that lasts 24 hours", "A server crash", "B"],
    ["What is Steganography?", "Writing in shorthand", "The practice of concealing a file, message, image, or video within another file", "Encrypting a hard drive", "Cracking a password", "B"],
    ["What does a Salting a password mean?", "Making it taste better", "Adding random data to the password before hashing it to defend against dictionary/rainbow table attacks", "Encrypting it twice", "Deleting it", "B"],
    ["What is Identity and Access Management (IAM)?", "A framework for business processes that facilitates the management of electronic or digital identities", "A firewall router", "A phishing technique", "An antivirus brand", "A"],
    ["What is a Buffer Overflow?", "Too many passwords", "An anomaly where a program overruns a buffer's boundary and overwrites adjacent memory locations", "A network flood", "A database error", "B"],
    ["What is meant by 'Defense in Depth'?", "Putting servers underground", "An information assurance concept where multiple layers of security controls are placed throughout an IT system", "Using a very long password", "Encrypting files multiple times", "B"],
    ["What is a Botnet?", "A network of autonomous robots", "A network of private computers infected with malicious software and controlled as a group without the owners' knowledge", "A chat bot system", "A secure network", "B"],
    ["What is MAC (Media Access Control) address spoofing?", "Faking an Apple computer", "Changing a factory-assigned MAC address of a network interface to disguise identity", "Intercepting network traffic", "Hacking a database", "B"],
    ["What is an Air Gap?", "A space in the cloud", "A network security measure employed on one or more computers to ensure that a secure computer network is physically isolated from unsecured networks", "A firewall brand", "A wireless protocol", "B"],
    ["What is the purpose of a SIEM?", "Social Intelligence Email Manager", "Security Information and Event Management provides real-time analysis of security alerts generated by applications and network hardware", "A database index", "A network cable", "B"],
    ["What is clickjacking?", "Stealing a mouse", "A malicious technique of tricking a user into clicking on something different from what the user perceives", "A DDOS attack", "A virus that clicks", "B"],
    ["What is the role of a DMZ (Demilitarized Zone) in networking?", "A war zone", "A physical or logical subnetwork that contains and exposes an organization's external-facing services to an untrusted network", "A private network only", "A switch protocol", "B"],
    ["What is ARP Spoofing?", "Faking an IP address", "Sending falsified ARP messages over a local area network to link an attacker's MAC address with the IP address of a legitimate computer", "A DNS attack", "A router failure", "B"],
    ["What is the primary function of a VPN in security?", "To make internet faster", "To create a secure, encrypted connection (tunnel) over a less secure network", "To store passwords", "To stop viruses", "B"],
    ["What is Session Hijacking?", "Taking over a meeting", "The exploitation of a valid computer session to gain unauthorized access to information or services", "Stealing a laptop", "A SQL injection", "B"],
    ["What is spear phishing?", "Phishing using a spear", "An email or electronic communications scam targeted towards a specific individual, organization or business", "Generic spam email", "A phone call scam", "B"],
    ["What is a rainbow table attack?", "An attack using colorful UI", "A password cracking method utilizing a precomputed table for reversing cryptographic hash functions", "A DDOS variation", "A network interception", "B"]
  ],
  hard: [
    ["What is Forward Secrecy (PFS)?", "Keeping secrets well", "A feature of specific key agreement protocols that gives assurances your session keys will not be compromised even if the private key of the server is compromised in the future", "A firewall rule", "A hashing algorithm", "B"],
    ["Explain the Diffie-Hellman Key Exchange.", "A password manager", "A method of securely exchanging cryptographic keys over a public channel without sending the actual key", "A hashing function", "An AES mode", "B"],
    ["What is Cross-Site Request Forgery (CSRF)?", "An XSS variant", "An attack that forces an end user to execute unwanted actions on a web application in which they're currently authenticated", "A database drop", "A network MITM", "B"],
    ["How do you mitigate CSRF?", "Use stronger passwords", "Use anti-CSRF tokens synchronizer patterns, or SameSite cookie attributes", "Use HTTPS", "Use an IPS", "B"],
    ["What is Return-Oriented Programming (ROP)?", "A functional programming paradigm", "A computer security exploit technique that allows an attacker to execute code in the presence of security defenses like executable space protection", "A database optimization", "A network routing protocol", "B"],
    ["What is ASLR?", "A routing protocol", "Address Space Layout Randomization, a technique to prevent exploitation of memory corruption vulnerabilities", "A hashing algorithm", "A firewall feature", "B"],
    ["What is the difference between OAuth and SAML?", "They are the same", "OAuth is geared towards API authorization; SAML is strongly geared towards enterprise SSO authentication", "SAML is for databases, OAuth is for networks", "OAuth is deprecated", "B"],
    ["What is a Side-Channel Attack?", "An attack from the side window", "Any attack based on information gained from the implementation of a computer system, rather than weaknesses in the implemented algorithm itself (e.g. power consumption, timing)", "A phishing attack", "A SQL inject", "B"],
    ["What is the role of an HSM (Hardware Security Module)?", "To store data", "A physical computing device that safeguards and manages digital keys for strong authentication and provides cryptoprocessing", "A brand of firewall", "A secure USB drive", "B"],
    ["What is PKI (Public Key Infrastructure)?", "A set of public servers", "A set of roles, policies, and procedures needed to create, manage, distribute, use, store, and revoke digital certificates and manage public-key encryption", "A VPN protocol", "A database schema", "B"],
    ["What is an Advanced Persistent Threat (APT)?", "A loud virus", "A stealthy threat actor, typically a nation state or state-sponsored group, which gains unauthorized access to a computer network and remains undetected for an extended period", "A simple phishing scheme", "A hardware failure", "B"],
    ["What is 'Heap Spraying'?", "Spraying memory with data", "A technique used in exploits to put a certain sequence of bytes at a predetermined memory location", "Cleaning server memory", "A database indexing method", "B"],
    ["What is Kerberos in network security?", "A three-headed dog", "A computer-network authentication protocol that works on the basis of tickets to allow nodes communicating over a non-secure network to prove their identity", "A VPN protocol", "An encryption algorithm", "B"],
    ["What is IPSec used for?", "To secure IP communications by authenticating and encrypting each IP packet of a communication session", "To format IP addresses", "To stop DDOS attacks", "To filter emails", "A"],
    ["What is the concept of 'Zero Trust'?", "Trust no one, verify everyone", "A security framework requiring all users, whether in or outside the organization's network, to be authenticated, authorized, and continuously validated", "A firewall that blocks everything", "A password manager", "B"],
    ["Explain Pass-the-Hash attack.", "Passing a hash map", "An exploit where an attacker steals a hashed user credential and, without cracking it, reuses it to trick an authentication system into creating a new authenticated session on the same network", "A rainbow table crack", "A SQL injection", "B"],
    ["What is Privilege Escalation?", "A network speed up", "The act of exploiting a bug, design flaw or configuration oversight in an operating system or software application to gain elevated access to resources", "Increasing network bandwidth", "Giving admin rights via UI", "B"],
    ["What is a watering hole attack?", "An attack near a river", "A security exploit in which the attacker seeks to compromise a specific group of end users by infecting websites that members of the group are known to visit", "A DNS spoofing method", "A physical attack on a server room", "B"],
    ["What does a WAF (Web Application Firewall) specifically do?", "Secures the local network", "Applies a set of rules to an HTTP conversation to protect web applications from common attacks like XSS and SQL Injection", "Blocks all port 80 traffic", "Encrypts hard drives", "B"],
    ["What is the difference between ECB and CBC modes in AES encryption?", "No difference", "ECB encrypts identical plaintext blocks into identical ciphertext blocks (insecure for patterns). CBC XORs each block with the previous ciphertext block (secure).", "ECB is faster and better", "CBC is only for hashing", "B"],
    ["What is certificate pinning?", "Pinning a certificate to a message board", "Restricting which certificates are considered valid for a particular website, overriding the system trust store to prevent MitM attacks via compromised CAs", "A VPN method", "Printing a digital certificate", "B"],
    ["What is a NOP Sled?", "A winter vehicle", "A sequence of NOP (no-operation) instructions meant to slide the CPU's instruction execution flow to its final, desired destination (the shellcode)", "A database query", "A network packet type", "B"],
    ["What is an Out-of-Band (OOB) vulnerability?", "A vulnerability outside a network band", "A vulnerability where the attacker retrieves the results of an attack using a different channel than the one used to send the malicious request", "A Wi-Fi exploit", "A hardware flaw", "B"],
    ["What does 'Living off the Land' mean in cyber attacks?", "Farming data", "Using legitimate, pre-installed tools and scripts (like PowerShell) already present in the target environment to carry out attacks", "Physical server theft", "Using open source software", "B"],
    ["What is the MITRE ATT&CK framework?", "A literal attack software", "A globally-accessible knowledge base of adversary tactics and techniques based on real-world observations", "A network scanner", "A government agency", "B"]
  ]
};

const htmlQuestions = {
  easy: [
    ["What does HTML stand for?", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Markup Language", "A"],
    ["Who is making the Web standards?", "Google", "Mozilla", "The World Wide Web Consortium", "Microsoft", "C"],
    ["Choose the correct HTML element for the largest heading:", "<h6>", "<heading>", "<h1>", "<head>", "C"],
    ["What is the correct HTML element for inserting a line break?", "<break>", "<br>", "<lb>", "<newline>", "B"],
    ["What is the correct HTML for adding a background color?", "<background>yellow</background>", "<body bg='yellow'>", "<body style='background-color:yellow;'>", "<body color='yellow'>", "C"],
    ["Choose the correct HTML element to define important text", "<strong>", "<i>", "<b>", "<important>", "A"],
    ["Choose the correct HTML element to define emphasized text", "<italic>", "<i>", "<em>", "<e>", "C"],
    ["What is the correct HTML for creating a hyperlink?", "<a>http://www.w3schools.com</a>", "<a href='http://www.w3schools.com'>W3Schools</a>", "<a url='http://www.w3schools.com'>W3Schools.com</a>", "<a>name='http://www.w3schools.com'</a>", "B"],
    ["Which character is used to indicate an end tag?", "/", "<", "*", "^", "A"],
    ["How can you open a link in a new tab/browser window?", "<a href='url' target='new'>", "<a href='url' new>", "<a href='url' target='_blank'>", "<a href='url' blank>", "C"],
    ["Which of these elements are all <table> elements?", "<table><tr><tt>", "<thead><body><tr>", "<table><tr><td>", "<table><head><tfoot>", "C"],
    ["Inline elements are normally displayed without starting a new line.", "True", "False", "Sometimes", "Only in CSS3", "A"],
    ["How can you make a numbered list?", "<nl>", "<ul>", "<dl>", "<ol>", "D"],
    ["How can you make a bulleted list?", "<list>", "<ol>", "<ul>", "<dl>", "C"],
    ["What is the correct HTML for making a checkbox?", "<checkbox>", "<check>", "<input type='checkbox'>", "<input type='check'>", "C"],
    ["What is the correct HTML for making a text input field?", "<textinput type='text'>", "<input type='text'>", "<textfield>", "<input type='textfield'>", "B"],
    ["What is the correct HTML for inserting an image?", "<image src='image.gif' alt='MyImage'>", "<img alt='MyImage'>image.gif</img>", "<img src='image.gif' alt='MyImage'>", "<img href='image.gif' alt='MyImage'>", "C"],
    ["Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?", "longdesc", "alt", "title", "src", "B"],
    ["Which doctype is correct for HTML5?", "<!DOCTYPE HTML5>", "<!DOCTYPE html>", "<!DOCTYPE HTML PUBLIC>", "<DOCTYPE html>", "B"],
    ["Which HTML element is used to specify a footer for a document or section?", "<footer>", "<bottom>", "<section>", "<div>", "A"],
    ["In HTML, you can embed SVG elements directly into an HTML page.", "True", "False", "Only with plugins", "Only on Mac", "A"],
    ["Which HTML element is used to play video files?", "<media>", "<video>", "<movie>", "<play>", "B"],
    ["Which HTML element is used to play audio files?", "<sound>", "<audio>", "<mp3>", "<voice>", "B"],
    ["The HTML <canvas> element is used to:", "Draw graphics, on the fly, via scripting (usually JavaScript)", "Display database records", "Manipulate data in SQL", "Create 3D animations directly", "A"],
    ["In HTML, what does the <p> tag define?", "A paragraph", "A parameter", "A padding", "A point", "A"]
  ],
  medium: [
    ["Which attribute is used to provide a unique identifier for an element?", "class", "name", "id", "key", "C"],
    ["What is the purpose of the <head> element?", "To display the main heading of the page", "To contain metadata, title, and links to scripts and stylesheets", "To show the header logo", "To define the top margin", "B"],
    ["What does the <meta charset='UTF-8'> tag do?", "Sets the font size", "Specifies the character encoding for the HTML document", "Links to an external charset file", "Encrypts the document", "B"],
    ["Which element defines a navigation block?", "<nav>", "<navigation>", "<menu>", "<header>", "A"],
    ["What is semantic HTML?", "HTML that uses a lot of CSS", "HTML that introduces meaning to the web page rather than just presentation", "HTML version 4", "HTML parsed by JavaScript", "B"],
    ["What is the role of the <aside> element?", "To hide content", "To represent content that is tangentially related to the content around it (like a sidebar)", "To float an image right", "To comment out code", "B"],
    ["How do you group multiple form inputs together semantically?", "Using a <div>", "Using <fieldset> and <legend>", "Using <group>", "Using <formgroup>", "B"],
    ["What does the 'action' attribute in a <form> do?", "Defines the HTTP method (GET/POST)", "Specifies where to send the form-data when a form is submitted", "Validates the form", "Triggers a JavaScript function", "B"],
    ["What is the difference between a <div> and a <span>?", "<div> is block-level, <span> is inline", "<div> is inline, <span> is block-level", "<div> is for text, <span> is for images", "No difference", "A"],
    ["Which input type is specifically designed for entering a URL?", "<input type='url'>", "<input type='link'>", "<input type='website'>", "<input type='text' pattern='url'>", "A"],
    ["What does the 'placeholder' attribute do?", "Reserves space for an image", "Specifies a short hint that describes the expected value of an input field", "Styles the input border", "Submits the data", "B"],
    ["How do you correctly embed an iframe?", "<iframe src='url'></iframe>", "<frame url='url'></frame>", "<window href='url'>", "<embed iframe='url'>", "A"],
    ["What is the purpose of the <label> tag?", "To label an image", "To define a label for several form elements, improving accessibility and usability", "To name a variable", "To replace <span>", "B"],
    ["How do you link a <label> to an <input>?", "By nesting the input, or using the 'for' attribute matching the input's 'id'", "Using the 'name' attribute", "Using the 'class' attribute", "It links automatically by proximity", "A"],
    ["Which tag is used to write a dropdown list?", "<list>", "<select>", "<dropdown>", "<menu>", "B"],
    ["What tag is used to define an option in a drop-down list?", "<item>", "<select-element>", "<option>", "<choice>", "C"],
    ["What does <datalist> do?", "Connects to a database", "Specifies a list of pre-defined options for an <input> element (autocomplete)", "Creates a table", "Lists data files", "B"],
    ["What is the <figure> and <figcaption> pair used for?", "To draw charts", "To group media content with an optional caption", "To style text creatively", "To display mathematical figures", "B"],
    ["Which tag is used for defining preformatted text?", "<pre>", "<format>", "<code>", "<text>", "A"],
    ["What does the 'required' attribute do in an input tag?", "Makes the input read-only", "Specifies that an input field must be filled out before submitting the form", "Forces a specific font", "Requires a password", "B"],
    ["What is the tabindex attribute used for?", "To index a database", "To specify the tab order of an element (when the user uses the 'Tab' button to navigate)", "To add tabular spacing", "To open new tabs", "B"],
    ["How do you specify a multi-line text input?", "<multiline>", "<input type='textarea'>", "<textarea>", "<text block>", "C"],
    ["Which HTML element represents computer code?", "<pre>", "<script>", "<code>", "<computer>", "C"],
    ["What does the 'defer' attribute on a <script> tag do?", "Stops the script from running", "Defers the execution of the script until the HTML parser has finished parsing the page", "Delays loading by 5 seconds", "Ignores errors", "B"],
    ["What is the purpose of the <main> tag?", "To specify the primary CSS", "To represent the dominant content of the <body>", "To hold the main header", "To start the document", "B"]
  ],
  hard: [
    ["What is the difference between LocalStorage and SessionStorage (HTML5 Web Storage)?", "They are identical", "LocalStorage persists after browser is closed, SessionStorage is cleared when the page session ends", "LocalStorage holds more data", "SessionStorage is encrypted", "B"],
    ["Explain the meaning of 'ARIA' in HTML.", "A markup language", "Accessible Rich Internet Applications, a set of attributes that define ways to make web content and web applications more accessible to people with disabilities", "A CSS framework", "A browser engine", "B"],
    ["What does the 'async' attribute do on a script tag compared to 'defer'?", "They are the same", "Async downloads the script simultaneously and executes it immediately upon download (pausing parsing). Defer waits until HTML parsing is complete.", "Async applies to CSS, defer to JS", "Async is deprecated", "B"],
    ["What is a Shadow DOM?", "A dark mode feature", "A scoped DOM tree that is attached to an element, but separate from the actual main document DOM (used largely in Web Components)", "A proxy server", "A CSS shadow effect", "B"],
    ["What is the 'rel' attribute used for in the <link> tag?", "To map relational databases", "To specify the relationship between the current document and the linked document (e.g., stylesheet)", "To release memory", "To reload the page", "B"],
    ["What is the purpose of the <template> tag?", "To design themes", "To hold client-side content that is not to be rendered when a page is loaded, but may subsequently be instantiated during runtime using JavaScript", "To replace <div>", "A server-side include", "B"],
    ["What does the 'contenteditable' attribute do?", "Allows the user to edit the text content of an element natively in the browser", "Enables a rich text editor plugin", "Allows you to edit the source code", "Validates forms", "A"],
    ["What is the `<picture>` element used for?", "Just another way to write `<img>`", "To provide multiple `<source>` elements for different display/device scenarios (responsive images) and one fallback `<img>`", "To draw canvases", "To process photos", "B"],
    ["How do you implement HTML5 drag and drop?", "By importing jQuery", "By setting the draggable attribute to true on an element and listening to drag events (dragstart, dragover, drop) via JavaScript", "It works automatically on all elements", "Using CSS `drag: true`", "B"],
    ["What does the `srcset` attribute do on an `<img>` tag?", "Sets a secure image", "Allows authors to provide multiple image resources and specify the conditions under which a browser should choose each one", "Changes images on hover", "Crops the image", "B"],
    ["What are Web Workers in HTML5?", "Scripts that run in the background, independently of the user interface scripts, allowing complex calculations without blocking the UI thread", "Employees of the W3C", "Browser extensions", "CSS processing scripts", "A"],
    ["What is the <base> element?", "A tag to specify a base color", "A tag that specifies the base URL and/or target for all relative URLs in a document", "The root tag replacing <html>", "A database connection string", "B"],
    ["What is the purpose of the 'nonce' attribute (e.g. in script tags)?", "To format numbers", "A cryptographic number used once as part of a Content Security Policy (CSP) to allow specific inline scripts to execute", "To block ads", "To prioritize scripts", "B"],
    ["What is Cross-Origin Resource Sharing (CORS) in relation to HTML APIs like Fetch?", "A database feature", "A mechanism that uses additional HTTP headers to tell browsers to give a web application running at one origin, access to selected resources from a different origin", "A way to share CSS", "A HTML5 tag `<cors>`", "B"],
    ["How does the HTML5 History API work?", "It clears the browser history", "It provides methods like pushState() and replaceState() that allow you to modify a website's URL without a full page reload (used in SPA routing)", "It predicts user behavior", "It logs user metadata", "B"],
    ["What is a Service Worker?", "A server employee", "A script that your browser runs in the background, enabling features like push notifications and background sync, and offline caching", "A CSS background", "An AI assistant", "B"],
    ["What does the 'download' attribute do on an <a> tag?", "Installs a virus", "Instructs the browser to download the linked resource rather than navigating to it", "Speeds up the link", "It is not a real attribute", "B"],
    ["What is the difference between <output> and <input>?", "<output> is not a real tag", "<output> represents the result of a calculation or user action, while <input> takes data", "No difference", "<output> is for printers", "B"],
    ["How do you use the Geolocation API in HTML5?", "Using the <geo> tag", "Using navigator.geolocation.getCurrentPosition() via JavaScript", "Using a Google Maps iframe", "It is not built into HTML5", "B"],
    ["What does the manifest file do in the context of PWAs (HTML5)?", "Creates a virus", "Provides information about a web application in a JSON text file, necessary for the web app to be downloaded and be presented to the user similarly to a native app", "Deletes old files", "Manages dependencies", "B"],
    ["What is the <track> element?", "A music tracker", "Used as a child of the <audio> or <video> elements to specify timed text tracks (for example, subtitles or captions)", "A mouse tracking script", "A database tracker", "B"],
    ["What is the benefit of the 'preload' value for the <link rel=\"\"> tag?", "It acts as a placeholder", "It tells the browser to download a specific resource as soon as possible, as it is needed for the current page", "It delays the loading", "It caches the page forever", "B"],
    ["What constitutes a valid custom data attribute?", "data-* where * is a custom name, used to store custom data private to the page or application", "custom-*", "info-*", "prop-*", "A"],
    ["What is proper way to write a strictly self-closing tag in HTML5?", "<br/> or <br>, HTML5 is lenient unlike XHTML", "Only <br />", "Only </br>", "Self closing tags are illegal in HTML5", "A"],
    ["How does the <details> and <summary> tag work?", "They generate a PDF", "They create a native disclosure widget from which the user can retrieve additional information or hide it natively without JS", "They summarize text using AI", "They format table data", "B"]
  ]
};

const cssQuestions = {
  easy: [
    ["What does CSS stand for?", "Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets", "B"],
    ["What is the correct HTML for referring to an external style sheet?", "<link rel='stylesheet' type='text/css' href='mystyle.css'>", "<style src='mystyle.css'>", "<stylesheet>mystyle.css</stylesheet>", "<css link='mystyle.css'>", "A"],
    ["Where in an HTML document is the correct place to refer to an external style sheet?", "In the <body> section", "In the <head> section", "At the end of the document", "Inside a <div>", "B"],
    ["Which HTML tag is used to define an internal style sheet?", "<script>", "<style>", "<css>", "<design>", "B"],
    ["Which HTML attribute is used to define inline styles?", "class", "style", "font", "styles", "B"],
    ["Which is the correct CSS syntax?", "body:color=black;", "{body:color=black;}", "body {color: black;}", "{body;color:black;}", "C"],
    ["How do you insert a comment in a CSS file?", "// this is a comment", "// this is a comment //", "/* this is a comment */", "' this is a comment", "C"],
    ["Which property is used to change the background color?", "bgcolor", "color", "background-color", "bg-color", "C"],
    ["How do you add a background color for all <h1> elements?", "h1 {background-color:#FFFFFF;}", "h1.all {background-color:#FFFFFF;}", "all.h1 {background-color:#FFFFFF;}", "h1 {color:#FFFFFF;}", "A"],
    ["Which CSS property is used to change the text color of an element?", "fgcolor", "color", "text-color", "font-color", "B"],
    ["Which CSS property controls the text size?", "font-style", "text-style", "text-size", "font-size", "D"],
    ["What is the correct CSS syntax for making all the <p> elements bold?", "p {text-size:bold;}", "p {font-weight:bold;}", "<p style='font-size:bold;'>", "p {style:bold;}", "B"],
    ["How do you display hyperlinks without an underline?", "a {text-decoration:none;}", "a {text-decoration:no-underline;}", "a {underline:none;}", "a {decoration:no-underline;}", "A"],
    ["How do you make each word in a text start with a capital letter?", "text-transform:capitalize", "text-transform:uppercase", "text-style:capitalize", "transform:capitalize", "A"],
    ["Which property is used to change the font of an element?", "font-weight", "font-style", "font-family", "typeface", "C"],
    ["How do you make the text bold?", "font:bold;", "style:bold;", "font-weight:bold;", "text-weight:bold;", "C"],
    ["How do you select an element with id 'demo'?", "#demo", ".demo", "demo", "*demo", "A"],
    ["How do you select elements with class name 'test'?", "#test", "test", ".test", "*test", "C"],
    ["How do you select all p elements inside a div element?", "div p", "div.p", "div + p", "div ~ p", "A"],
    ["How do you group selectors?", "Separate with a plus sign", "Separate with a comma", "Separate with a space", "Don't separate them", "B"],
    ["What is the default value of the position property?", "relative", "fixed", "absolute", "static", "D"],
    ["Which property is used to change the left margin of an element?", "margin-left", "padding-left", "indent", "spacing-left", "A"],
    ["When using the padding property, are you allowed to use negative values?", "Yes", "No", "Only for top and bottom", "Only in CSS3", "B"],
    ["How do you format a list so that its items have no bullet points?", "list-style-type: none;", "list: none;", "bullet-style: none;", "text-decoration: none;", "A"],
    ["What does the 'z-index' property do?", "Sets the zoom level", "Specifies the stack order of an element (which element should be placed in front of, or behind, the others)", "Sets the x-axis", "No such property", "B"]
  ],
  medium: [
    ["Explain the CSS Box Model.", "A box holding CSS files", "It wraps every HTML element, consisting of: margins, borders, padding, and the actual content", "A tool to draw squares on websites", "A 3D modeling feature", "B"],
    ["What is the difference between 'visibility: hidden' and 'display: none'?", "They are the same", "display:none removes the element from the document flow; visibility:hidden hides it but it still takes up space", "visibility:hidden removes it from the flow", "display:none is used only for text", "B"],
    ["What is Flexbox?", "A JavaScript library", "A one-dimensional layout method for laying out items in rows or columns", "A flexible database", "An animation tool", "B"],
    ["How do you center a block element horizontally using margins?", "margin: center;", "margin: auto;", "margin: 0 auto;", "align: center;", "C"],
    ["What does 'position: absolute' do?", "Positions an element relative to the browser window always", "Positions an element relative to its first positioned (not static) ancestor element", "Positions it in normal flow", "Positions it fixed to the screen", "B"],
    ["What does 'position: relative' do?", "Same as absolute", "Positions an element relative to its normal position, leaving a gap where it would normally be", "It locks the element", "Positions it relative to the child", "B"],
    ["What are pseudo-classes in CSS?", "Fake classes that do nothing", "Keywords appended to a selector that specify a special state of the element (e.g., :hover)", "Classes applied via JavaScript only", "HTML tags", "B"],
    ["Which pseudo-class is used to style an element when a user mouses over it?", ":focus", ":active", ":hover", ":mouseover", "C"],
    ["What is a pseudo-element?", "An element created in JavaScript", "A keyword appended to a selector that lets you style a specific part of the selected element (e.g., ::before, ::first-line)", "A hidden HTML tag", "A broken element", "B"],
    ["What is CSS Grid?", "A graph drawing tool", "A two-dimensional layout system for the web", "A framework like Bootstrap", "An older version of table layouts", "B"],
    ["How do you use CSS variables (custom properties)?", "--my-color: blue; and using var(--my-color)", "var myColor = 'blue';", "$my-color: blue;", "@my-color: blue;", "A"],
    ["What does 'box-sizing: border-box' do?", "Creates a 3D box", "Tells the browser to account for any border and padding in the values you specify for an element's width and height", "Removes padding", "Forces margin to zero", "B"],
    ["What is the purpose of media queries?", "To play audio files", "To apply CSS properties only if a certain condition is true (e.g., screen width), used for responsive design", "To fetch data from a server", "To print pages", "B"],
    ["What is the difference between em and rem units?", "No difference", "em is relative to the parent element's font size; rem is relative to the root (html) element's font size", "em is relative to the screen width, rem to screen height", "rem is absolute, em is relative", "B"],
    ["What are CSS preprocessors?", "Browsers", "Programs that let you generate CSS from the preprocessor's own unique syntax (like Sass, LESS)", "HTML validators", "Compression tools", "B"],
    ["How do you select all elements with the 'data-cy' attribute?", "[data-cy]", ".data-cy", "#data-cy", "*data-cy", "A"],
    ["What is the default flex-direction in Flexbox?", "column", "row-reverse", "row", "column-reverse", "C"],
    ["Which property defines how flex items are aligned along the main axis?", "align-items", "justify-content", "align-content", "flex-wrap", "B"],
    ["Which property defines how flex items are aligned along the cross axis typically?", "justify-content", "align-content", "align-items", "margin-auto", "C"],
    ["What is the CSS 'calc()' function used for?", "Counting elements", "Performing calculations to determine CSS property values (e.g., calc(100% - 20px))", "Triggering JavaScript", "Calculating server response time", "B"],
    ["What does 'opacity: 0.5' do?", "Makes text bolder", "Sets the transparency of an element to 50%", "Changes the color to gray", "Hides the element from screen readers", "B"],
    ["What does the 'transition' property do?", "Changes the URL", "Allows you to change property values smoothly over a given duration", "Creates a grid", "Hides the element instantly", "B"],
    ["What does 'overflow: hidden' do?", "Always adds scrollbars", "Clips the content and completely hides any content that overflows the element's box", "Allows text to spill out", "Shrinks the text", "B"],
    ["What is specificity in CSS?", "A random guess", "The algorithm used by browsers to determine which CSS rule applies if multiple rules match the same element", "The size of a CSS file", "The version of CSS", "B"],
    ["What is a 'reset CSS' or 'normalize.css'?", "A script to delete the webpage", "A stylesheet that forces browsers to render all elements more consistently and in line with modern standards, resetting default browser styles", "A database wipe tool", "A virus", "B"]
  ],
  hard: [
    ["Explain the CSS specificity hierarchy.", "Inline styles > ID selectors > Classes/Attributes/Pseudo-classes > Elements/Pseudo-elements", "ID > Inline > Class > Element", "Element > Class > ID > Inline", "Random order", "A"],
    ["What does the '!important' declaration do?", "Deletes other styles", "Overrides any other declarations, ignoring standard specificity rules", "Makes the text blink", "Validates the CSS", "B"],
    ["What is the 'Block Formatting Context' (BFC)?", "A text formatting tool", "A part of a visual CSS rendering of a web page; an isolated region in which floats interact with other elements", "A database block", "A Javascript scope", "B"],
    ["How does the 'transform: translateZ(0)' or 'will-change' property affect rendering?", "It pauses animations", "It triggers hardware acceleration using the GPU for smoother animations", "It changes z-index to 0", "It shrinks the element to 0", "B"],
    ["What is the difference between 'nth-child' and 'nth-of-type'?", "They are the same", "nth-child selects based on the exact index of the child in its parent, regardless of type. nth-of-type counts only elements of the specified type.", "nth-of-type is faster", "nth-child only works on divs", "B"],
    ["How do you clear floated elements?", "clear: both; (or using a clearfix hack)", "float: none;", "display: block;", "position: absolute;", "A"],
    ["What is a CSS Sprite?", "A fairy animation", "Combining multiple images into a single image document to reduce the number of HTTP requests", "A CSS processor", "A new CSS framework", "B"],
    ["What does 'pointer-events: none' do?", "Hides the mouse", "Prevents all click, state and cursor options on the specified HTML element, passing events to the element underneath", "Disables the keyboard", "Disables all CSS", "B"],
    ["What is the difference between 'max-width: 100%' and 'width: 100%' on an image?", "No difference", "width:100% forces the image to be the container width (potentially stretching). max-width:100% scales it down if container is smaller, but never scales it up past its original size.", "width is faster", "max-width is deprecated", "B"],
    ["How does the Grid 'fr' unit work?", "It stands for frames", "It stands for fraction of the available free space in the grid container", "It calculates font height", "It sets fixed pixels", "B"],
    ["What does 'contain: paint' do?", "Paints a background color", "A CSS Containment property that tells the browser the element's descendants don't display outside its bounds, optimizing rendering performance", "Clears the canvas", "Draws a border", "B"],
    ["What is the new ':has()' pseudo-class in modern CSS?", "A way to check variables", "A relational pseudo-class (parent selector) that allows you to style an element depending on its descendants", "It checks if text exists", "An array method", "B"],
    ["What is 'CSS Houdini'?", "A magic trick", "A set of low-level APIs that expose parts of the CSS engine, giving developers the power to extend CSS by hooking into the styling and layout process", "A new compiler", "A JavaScript framework", "B"],
    ["How do you implement a sticky footer using CSS?", "Using Flexbox on the body (min-height: 100vh, flex-direction: column) and flex-grow: 1 on the main content", "position: absolute;", "margin-bottom: 0;", "You must use JS", "A"],
    ["What is the difference between CSS variables (Custom properties) and SASS variables?", "SASS variables are resolved at compile time; CSS variables are resolved at runtime and can be updated by JS or cascade", "They are identical", "SASS variables are faster in the browser", "CSS variables only hold colors", "A"],
    ["What does 'background-attachment: fixed' do?", "Freezes the browser", "Determines that the background image will not scroll with the page", "Attaches an image permanently", "Removes the image", "B"],
    ["What is 'clamp()' in CSS?", "A physical tool", "A CSS math function that clamps a value between an upper and lower bound (minimum, preferred, maximum)", "A way to group divs", "A string manipulator", "B"],
    ["What is the 'aspect-ratio' property?", "It measures screens", "It sets a preferred aspect ratio for the box, which will be used in the calculation of auto sizes and some other layout functions", "It changes colors", "It applies filters", "B"],
    ["How does the CSS @supports rule work (Feature Queries)?", "Provides technical support info", "Allows you to test if the browser supports a specific CSS feature and apply a block of CSS only if it does", "Checks for screen resolution", "Fixes bugs automatically", "B"],
    ["What are CSS Container Queries?", "Querying a database container", "A feature that allows you to apply styling based on the size of the element's container rather than the viewport", "A Docker feature", "An old Flexbox feature", "B"],
    ["What does 'mix-blend-mode' do?", "Mixes JavaScript and CSS", "Defines how an element's content should blend with the content of the element's direct parent and the element's background", "Mixes colors into gradients automatically", "Blurs text", "B"],
    ["What is styling 'FOUC'?", "A CSS framework", "Flash of Unstyled Content: an instance where a web page appears briefly with the browser's default styles prior to loading an external CSS stylesheet", "A rendering engine", "A pseudo-class", "B"],
    ["What is 'line-height' primarily used for?", "Drawing lines", "Setting the vertical spacing between lines of text", "Measuring divs", "Applying borders", "B"],
    ["How do you create a basic CSS animation?", "Using the @keyframes rule to define the animation and linking it to an element via the animation property", "Using Javascript setInterval", "Using the <animate> tag", "Using transition only", "A"],
    ["What is 'backdrop-filter' in CSS?", "A database filter", "A property that lets you apply graphical effects such as blurring or color shifting to the area behind an element (e.g. glassmorphism)", "A filter for background images only", "A way to hide backgrounds", "B"]
  ]
};

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'skilllens_db' });
  const allDb = { 
    'java': javaQuestions, 
    'cyber security': cyberQuestions, 
    'html': htmlQuestions, 
    'css': cssQuestions 
  };

  for (const [skill, levelsData] of Object.entries(allDb)) {
    let skillId;
    const [sRows] = await conn.query('SELECT id FROM skills WHERE name = ?', [skill]);
    if (sRows.length > 0) skillId = sRows[0].id;
    else {
      const [insertS] = await conn.query('INSERT INTO skills (name) VALUES (?)', [skill]);
      skillId = insertS.insertId;
    }

    for (const [diff, qs] of Object.entries(levelsData)) {
      const quizTitle = `${skill.toUpperCase()} ${diff.charAt(0).toUpperCase() + diff.slice(1)} Assessment`;
      
      let quizId;
      const [qRows] = await conn.query('SELECT id FROM quizzes WHERE title = ? AND skill_id = ?', [quizTitle, skillId]);
      if (qRows.length > 0) {
        quizId = qRows[0].id;
        await conn.query('DELETE FROM questions WHERE quiz_id = ?', [quizId]); // Wipe existing dummy questions
      } else {
        const [insertQ] = await conn.query('INSERT INTO quizzes (title, skill_id, difficulty) VALUES (?, ?, ?)', [quizTitle, skillId, diff]);
        quizId = insertQ.insertId;
      }

      for (let qData of qs) {
        await conn.query(
          'INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [quizId, qData[0], qData[1], qData[2], qData[3], qData[4], qData[5]]
        );
      }
      console.log(`Seeded EXACTLY 25 unique real ${diff} questions for ${skill}`);
    }
  }
  await conn.end();
}
run();
