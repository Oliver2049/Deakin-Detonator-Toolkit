import { Button, LoadingOverlay, NumberInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { UserGuide } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile } from "../SaveOutputToFile/SaveOutputToTextFile";

const title = "SnmpCheck";
const description_userguide =
    "The SNMP Check tool enables you to perform SNMP (Simple Network Management Protocol) checks on a specific IP " +
    "address or hostname and port. SNMP is a widely used protocol for managing and monitoring network devices." +
    " \n\nTo perform a scan, follow these steps: \n\n" +
    "Step 1: Enter the IP address or hostname of the target device\n\n" +
    "Step 2 (Optional): Specify a target port number (default port: 161). \n\n" +
    "Step 3: Click the 'Scan' button to initiate the SNMP check.\n\n" +
    "The tool will establish a connection to the specified device and retrieve SNMP-related information, such as system details, interfaces, and performance metrics. The results will be displayed in the console below.";
("Please note that SNMP checks require appropriate permissions and credentials. Ensure that you have the necessary access rights before performing a scan.");

interface FormValues {
    ip: string;
    port: number;
}

const SnmpCheck = () => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [pid, setPid] = useState("");

    let form = useForm({
        initialValues: {
            ip: "",
            port: 161,
        },
    });

    // Uses the callback function of runCommandGetPidAndOutput to handle and save data
    // generated by the executing process into the output state variable.
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data); // Update output
    }, []);

    // Uses the onTermination callback function of runCommandGetPidAndOutput to handle
    // the termination of that process, resetting state variables, handling the output data,
    // and informing the user.
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code: number; signal: number }) => {
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated.");
            } else {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`);
            }
            // Clear the child process pid reference
            setPid("");
            // Cancel the Loading Overlay
            setLoading(false);
        },
        [handleProcessData]
    );

    // Sends a SIGTERM signal to gracefully terminate the process
    const handleCancel = () => {
        if (pid !== null) {
            const args = [`-15`, pid];
            CommandHelper.runCommand("kill", args);
        }
    };

    const onSubmit = async (values: FormValues) => {
        setLoading(true);

        const args = [values.ip, "-p", `${values.port}`];

        try {
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "snmp-check",
                args,
                handleProcessData,
                handleProcessTermination
            );
            setPid(result.pid);
            setOutput(result.output);
        } catch (e: any) {
            setOutput(e.message);
        }
    };

    const clearOutput = useCallback(() => {
        setOutput("");
    }, [setOutput]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <LoadingOverlay visible={loading} />
            {loading && (
                <div>
                    <Button variant="outline" color="red" style={{ zIndex: 1001 }} onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            )}
            <Stack>
                {UserGuide(title, description_userguide)}
                <TextInput label={"IP or Hostname"} required {...form.getInputProps("ip")} />
                <NumberInput label={"Port"} {...form.getInputProps("port")} />
                <Button type={"submit"}>Scan</Button>
                {SaveOutputToTextFile(output)}
                <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
            </Stack>
        </form>
    );
};

export default SnmpCheck;
