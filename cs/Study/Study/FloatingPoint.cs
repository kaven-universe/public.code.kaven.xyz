using System.Diagnostics;

namespace Study
{
    public class FloatingPoint
    {
        public static void Run()
        {
            var v = Math.Pow(2, 24); ;

            var f = Convert.ToSingle(v);

            Debug.Assert(f == v);

            Debug.Assert(f - 1 == v - 1);
            Debug.Assert(f + 1 != v + 1);

            var i = 10;
            while (i-- > 0)
            {
                Debug.WriteLine(f++);
            }

            i = 10;
            while (i-- > 0)
            {
                Debug.WriteLine(f--);
            }
        }
    }
}
