# Tokenized Food Safety Contamination Prevention System

A comprehensive blockchain-based food safety system built with Clarity smart contracts for the Stacks blockchain. This system provides end-to-end tracking and management of food safety from producer verification to consumer notification.

## 🎯 Overview

The Tokenized Food Safety Contamination Prevention System consists of five interconnected smart contracts that work together to ensure food safety and traceability:

1. **Producer Verification Contract** - Manages registration and verification of food producers
2. **Safety Testing Contract** - Records and manages food safety testing results
3. **Contamination Tracking Contract** - Tracks contamination incidents and affected batches
4. **Recall Management Contract** - Manages product recalls when safety issues are detected
5. **Consumer Notification Contract** - Handles consumer notifications for safety alerts

## 🏗️ Architecture

### Smart Contracts

#### Producer Verification (`producer-verification.clar`)
- Register new food producers
- Verify producer credentials and licenses
- Track verification status and expiry dates
- Maintain producer database with verification history

#### Safety Testing (`safety-testing.clar`)
- Record safety test results for food batches
- Track different types of tests (bacterial, chemical, etc.)
- Update test results and contamination levels
- Maintain comprehensive testing history

#### Contamination Tracking (`contamination-tracking.clar`)
- Report contamination incidents
- Track severity levels (1-5 scale)
- Monitor contamination sources and types
- Update incident status throughout resolution

#### Recall Management (`recall-management.clar`)
- Initiate product recalls
- Set urgency levels (1-3 scale)
- Track recall status and completion
- Manage recall timelines and expiry dates

#### Consumer Notification (`consumer-notification.clar`)
- Create consumer safety notifications
- Manage different notification types
- Track notification delivery status
- Target specific batches or products

## 🚀 Features

### Core Functionality
- **Immutable Records**: All safety data is stored on-chain for transparency
- **Access Control**: Owner-only functions for critical operations
- **Batch Tracking**: Complete traceability from production to consumer
- **Multi-level Severity**: Graduated response based on contamination severity
- **Real-time Notifications**: Immediate consumer alerts for safety issues

### Data Integrity
- **Tamper-proof**: Blockchain ensures data cannot be altered
- **Audit Trail**: Complete history of all safety events
- **Verification**: Cryptographic proof of all transactions
- **Transparency**: Public access to safety information

## 📋 Prerequisites

- Stacks blockchain development environment
- Clarity CLI tools
- Node.js and npm for testing
- Vitest for running tests

## 🛠️ Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd food-safety-blockchain
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Deploy contracts to Stacks blockchain:
   \`\`\`bash
# Deploy each contract individually
clarinet deploy --network testnet
\`\`\`

## 🧪 Testing

Run the comprehensive test suite:

\`\`\`bash
# Run all tests
npm test

# Run specific contract tests
npm test producer-verification
npm test safety-testing
npm test contamination-tracking
npm test recall-management
npm test consumer-notification
\`\`\`

### Test Coverage
- Producer registration and verification
- Safety test recording and updates
- Contamination incident reporting
- Recall initiation and management
- Consumer notification creation and delivery
- Error handling and edge cases
- Access control validation

## 📖 Usage Examples

### Register a Producer
\`\`\`clarity
(contract-call? .producer-verification register-producer "Fresh Foods Inc" "LIC123456")
\`\`\`

### Record Safety Test
\`\`\`clarity
(contract-call? .safety-testing record-test u1 "BATCH001" "bacterial" "pass" u0 "All tests passed")
\`\`\`

### Report Contamination
\`\`\`clarity
(contract-call? .contamination-tracking report-contamination u1 "BATCH001" "E.coli" u3 "Production line")
\`\`\`

### Initiate Recall
\`\`\`clarity
(contract-call? .recall-management initiate-recall u1 "BATCH001" "Fresh Lettuce" "E.coli contamination" u2 u1234567890)
\`\`\`

### Create Consumer Notification
\`\`\`clarity
(contract-call? .consumer-notification create-notification "recall" "Product Recall Alert" "Fresh lettuce recalled due to contamination" u3 "BATCH001")
\`\`\`

## 🔒 Security Features

### Access Control
- Contract owner permissions for critical functions
- Producer-specific data access
- Immutable audit trails

### Data Validation
- Input validation for all parameters
- Severity level constraints (1-5 for contamination, 1-3 for recalls)
- Status validation for updates

### Error Handling
- Comprehensive error codes
- Graceful failure handling
- Clear error messages

## 🌐 Integration

### API Endpoints
The system can be integrated with external applications through:
- Web3 wallet connections
- REST API wrappers
- Real-time notification systems
- Mobile applications

### Data Export
- JSON format for external systems
- CSV export for reporting
- Real-time data feeds

## 📊 Monitoring & Analytics

### Key Metrics
- Producer verification rates
- Test pass/fail ratios
- Contamination incident frequency
- Recall response times
- Consumer notification delivery rates

### Reporting
- Safety compliance reports
- Contamination trend analysis
- Producer performance metrics
- Consumer safety statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 🔮 Future Enhancements

- Integration with IoT sensors for real-time monitoring
- Machine learning for contamination prediction
- Mobile app for consumer notifications
- Integration with supply chain management systems
- Multi-language support for global deployment

---

**Built with ❤️ for food safety and consumer protection**
