public static class Utility 
{
    public static void LogProcessInfo()
        {
            StartTask(() =>
            {
                // Start the process.
                var myProcess = Process.GetCurrentProcess();
                var list = new List<string>();

                using (var writer = File.CreateText(@"C:\Temp\pinfo.log"))
                {
                    writer.WriteLine($"{GetDebugDateTime()} start log: {myProcess.ToString()}");
                    while (true)
                    {
                        list.Clear();

                        if (!myProcess.HasExited)
                        {
                            // Refresh the current process property values.
                            myProcess.Refresh();                            

                            // Display current process statistics.

                            //list.Add(string.Format("{0} -", myProcess.ToString()));

                            list.Add(string.Format("\tphysical memory usage: {0, 20}, {1, 5} MB",
                                myProcess.WorkingSet64, myProcess.WorkingSet64/1024/1024));
                            list.Add(string.Format("\tbase priority: {0}",
                                myProcess.BasePriority));
                            list.Add(string.Format("\tpriority class: {0}",
                                myProcess.PriorityClass));
                            list.Add(string.Format("\tuser processor time: {0}",
                                myProcess.UserProcessorTime));
                            list.Add(string.Format("\tprivileged processor time: {0}",
                                myProcess.PrivilegedProcessorTime));
                            list.Add(string.Format("\ttotal processor time: {0}",
                                myProcess.TotalProcessorTime));
                            list.Add(string.Format("\tPagedSystemMemorySize64: {0, 20}, {1, 5} MB",
                                myProcess.PagedSystemMemorySize64, myProcess.PagedSystemMemorySize64/1024/1024));
                            list.Add(string.Format("\tPagedMemorySize64: {0, 20}, {1, 5} MB",
                               myProcess.PagedMemorySize64, myProcess.PagedMemorySize64/1024/1024));

                            // Update the values for the overall peak memory statistics.
                            var peakPagedMem = myProcess.PeakPagedMemorySize64;
                            var peakVirtualMem = myProcess.PeakVirtualMemorySize64;
                            var peakWorkingSet = myProcess.PeakWorkingSet64;

                            // Display peak memory statistics for the process.
                            list.Add(string.Format("\tPeak physical memory usage of the process: {0, 20}, {1, 5} MB",
                                peakWorkingSet, peakWorkingSet/1024/1024));
                            list.Add(string.Format("\tPeak paged memory usage of the process: {0, 20}, {1, 5} MB",
                                peakPagedMem, peakPagedMem / 1024 / 1024));
                            list.Add(string.Format("\tPeak virtual memory usage of the process: {0, 20}, {1, 5} MB",
                                peakVirtualMem, peakVirtualMem / 1024 / 1024));

                            if (myProcess.Responding)
                            {
                                list.Add(string.Format("\tStatus = Running"));
                            }
                            else
                            {
                                list.Add(string.Format("\tStatus = Not Responding"));
                            }
                        }

                        writer.WriteLine(string.Join(string.Empty, list));
                        writer.Flush();

                        Thread.Sleep(5000);
                    }
                }
            });
        }
}