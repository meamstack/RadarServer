if [[ $CONFIGUREIPTABLES = "Y" ]]; then
	echo "Setting iptables routing..."
	# Route 80 to $PORT
	sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports $PORT
	
	if [[ $SSLPARAM = "ENABLED" ]]; then
		sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports $SSLPORT
	fi
	
	# Store iptables after the network interface goes down
	# Based on Solution #2 from https://help.ubuntu.com/community/IptablesHowTo
	# Don't save the counters, we don't care
	echo '#!/bin/sh
iptables-save > /etc/iptables.rules
if [ -f /etc/iptables.downrules ]; then
   iptables-restore < /etc/iptables.downrules
fi
exit 0' | sudo tee /etc/network/if-post-down.d/iptablessave

	# Restore iptables before the network interface comes up
	echo '#!/bin/sh
iptables-restore < /etc/iptables.rules
exit 0' | sudo tee /etc/network/if-pre-up.d/iptablesload

	# Make both scripts executable
	sudo chmod +x /etc/network/if-post-down.d/iptablessave
	sudo chmod +x /etc/network/if-pre-up.d/iptablesload
fi

