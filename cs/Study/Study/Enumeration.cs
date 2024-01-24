using System.Diagnostics;

namespace Study
{
    public class Enumeration
    {
        private enum A
        {
            None,

            T1 = 1,
            T2 = 2,

            T1Alias = T1,
        }

        public static void Run()
        {
            var a = A.T1;
            var b = A.T1Alias;

            Trace.Assert(a == b);
            Trace.Assert(a.GetHashCode() == b.GetHashCode());
        }
    }
}
