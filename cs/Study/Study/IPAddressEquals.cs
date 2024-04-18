using System.Diagnostics;
using System.Net;

namespace Study
{
    internal class IPAddressEquals
    {
        public static void Run()
        {
            var ipAddress = IPAddress.Parse("127.0.0.1");
            var port = 8080;

            var endPoint1 = new IPEndPoint(ipAddress, port);
            var endPoint2 = new IPEndPoint(ipAddress, port);

            Debug.Assert(endPoint1 != endPoint2);
            Debug.Assert(endPoint1.Equals(endPoint2));

            var d1 = new Dictionary<IPEndPoint, int>
            {
                { endPoint1, 1 }
            };

            Debug.Assert(d1.ContainsKey(endPoint1));
            Debug.Assert(d1.ContainsKey(endPoint2));

            Debug.Assert(d1.TryGetValue(endPoint2, out _));
        }
    }
}
