#define Test

using System.Diagnostics;

namespace Study
{
    internal static class DebugTest
    {
        public static void Run()
        {
            Debug.WriteLine(Test());
        }

        private static string Test()
        {
#if DEBUG
            return "Test";
#else
            Trace.Assert(false);

            throw new NotImplementedException();
#endif
        }
    }
}
