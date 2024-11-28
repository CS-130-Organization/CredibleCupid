const { validate_text } = require('./profile_validation');
const { spawn } = require('child_process');
const { expect } = require('chai');
const sinon = require('sinon');

describe('Profile Validation', () => {
    let sandbox;
    
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    
    afterEach(() => {
        sandbox.restore();
    });

    it('should validate profile text and return probability', async () => {
        // Test profile data
        const testProfile = {
            name: "John Doe",
            bio: "I love hiking and photography"
        };

        // Mock the spawn process
        const mockSpawn = sandbox.stub(require('child_process'), 'spawn');
        
        // Create mock stdout and stderr streams
        const mockStdout = new require('stream').Readable();
        mockStdout._read = () => {};
        const mockStderr = new require('stream').Readable();
        mockStderr._read = () => {};
        
        // Create mock child process
        const mockChildProcess = {
            stdout: mockStdout,
            stderr: mockStderr,
            on: (event, callback) => {
                if (event === 'close') {
                    process.nextTick(() => callback(0));
                }
            }
        };
        
        mockSpawn.returns(mockChildProcess);
        
        // Start the validation
        const validationPromise = validate_text(testProfile);
        
        // Simulate Python script output
        mockStdout.push('0.85');
        mockStdout.push(null);
        
        // Get the result
        const result = await validationPromise;
        
        // Verify the result
        expect(result).to.equal(0.85);
        
        // Verify spawn was called correctly
        expect(mockSpawn.calledOnce).to.be.true;
        expect(mockSpawn.firstCall.args[0]).to.equal('python');
        expect(mockSpawn.firstCall.args[1]).to.deep.equal([
            'packages/frontend/src/scripts/profile_validator.py',
            'validate_text',
            JSON.stringify(testProfile)
        ]);
    });

    it('should handle Python process errors', async () => {
        const testProfile = {
            name: "John Doe",
            bio: "I love hiking and photography"
        };

        // Mock spawn with error
        const mockSpawn = sandbox.stub(require('child_process'), 'spawn');
        const mockChildProcess = {
            stdout: new require('stream').Readable({ read: () => {} }),
            stderr: new require('stream').Readable({ read: () => {} }),
            on: (event, callback) => {
                if (event === 'close') {
                    process.nextTick(() => callback(1));
                }
            }
        };
        
        mockSpawn.returns(mockChildProcess);

        // Verify error handling
        try {
            await validate_text(testProfile);
            expect.fail('Should have thrown an error');
        } catch (error) {
            expect(error).to.include('Python process exited with code 1');
        }
    });
}); 