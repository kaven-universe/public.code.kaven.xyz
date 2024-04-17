using System.Diagnostics;

namespace Conditional
{
    public class Conditional
    {
        [Conditional("Test")]
        public static void Test()
        {
            throw new NotImplementedException();
        }
    }
}
