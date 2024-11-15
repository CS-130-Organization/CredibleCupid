const { spawn } = require('child_process');

/**
 * validate_text
 * 
 * Takes a user profile JSON object, spawns a Python process to call 
 * ProfileValidator.validate_text from profile_validator.py, and returns
 * the probability that the profile is human-written.
 *
 * @param {Object} userProfile - The user profile data as a JSON object.
 * @returns {Promise<number>} - A promise that resolves to the human_probability.
 */
function validate_text(userProfile) {
    return new Promise((resolve, reject) => {
        // Stringify the user profile JSON
        const profileString = JSON.stringify(userProfile);

        // Spawn the Python process
        const pythonProcess = spawn('python', [
            'packages/frontend/src/scripts/profile_validator.py',
            'validate_text',
            profileString
        ]);

        let stdoutData = '';
        let stderrData = '';

        // Collect data from stdout
        pythonProcess.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        // Collect data from stderr
        pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        // Handle process exit
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`Python process exited with code ${code}: ${stderrData}`);
            } else {
                try {
                    const probability = parseFloat(stdoutData.trim());
                    resolve(probability);
                } catch (err) {
                    reject(`Failed to parse probability: ${err.message}`);
                }
            }
        });
    });
}

module.exports = { validate_text };
